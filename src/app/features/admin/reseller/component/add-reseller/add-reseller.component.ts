import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResellerService } from '../../service/reseller.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'add-reseller',
  templateUrl: './add-reseller.component.html',
  styleUrls: ['./add-reseller.component.scss']
})
export class AddResellerComponent {
  showPassword: boolean = false;
  resellerForm!: FormGroup;
  resellerData: any;
  selectedDealerId: any;
  resllerById: any;
  routePath:any = 'admin/reseller-raster';
  reseller: string = 'Add'

  constructor(
    private fb: FormBuilder,
    private resellerService: ResellerService,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.selectedDealerId = params.get('id');
      if (this.selectedDealerId) {
        this.getResellerByid()
      }
    });
  }

  ngOnInit() {
    this.selectedDealerId = this.activeRoute.snapshot.paramMap.get("id")

    this.setInitialValue();
    if (this.selectedDealerId) {
      this.reseller = 'Modify'
      this.getResellerByid()
    }
  }


  getResellerByid() {
    this.resellerService.getResellerById(this.selectedDealerId).subscribe((res: any) => {
      this.resllerById = res?.body?.Result?.Data;
      this.resellerForm = this.fb.group({
        name: [res?.body?.Result?.Data?.Name, [Validators.required]],
        orgName: [res?.body?.Result?.Data?.OrgName, [Validators.required]],
        loginId: [res?.body?.Result?.Data?.LoginId, [Validators.required]],
        email: [res?.body?.Result?.Data?.EmailId, [Validators.required,  Validators.email]],
        pwd: [res?.body?.Result?.Data?.Password, [Validators.required, Validators.pattern('')]],
        Address: [res?.body?.Result?.Data?.Address],
        phn: [res?.body?.Result?.Data?.MobileNo, [Validators.required, Validators.pattern('^[0-9]{10}$')]]
      });

    })
  }

  setInitialValue() {
    this.resellerForm = this.fb.group({
      name: ['', [Validators.required]],
      orgName: ['', [Validators.required]],
      loginId: ['', [Validators.required]],
      email: ['', [Validators.required,  Validators.email]],
      pwd: ['', [Validators.required, Validators.pattern('')]],
      Address: [''],
      phn: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit(formvalue: any) {
    if (this.resellerForm.invalid) {
      this.resellerForm.markAllAsTouched();
      return;
    }
    let payload = {
      "Id": 0,
      "ParentId": "",
      "DealerType": 1,
      "Name": formvalue.name,
      "OrgName": formvalue.orgName,
      "Address": formvalue.Address,
      "MobileNo": formvalue.phn,
      "EmailId": formvalue.email,
      "LoginId": formvalue.loginId,
      "Password": formvalue.pwd,
      "employee_type":1,
      "IsActive":1
    }
    let service = this.resellerService.reseller(payload)
    if (this.selectedDealerId) {
      payload['Id'] = this.resllerById?.Id;
      payload['DealerType'] = 2;
      service = this.resellerService.updateReseller(this.resllerById?.Id, payload)
    }

    service.subscribe((res: any) => {      
      this.resellerData = res?.body?.Result;
      if (res?.body?.ResponseMessage == "Success") {
        this.notificationService.showSuccess(this.resellerData?.Message);
        this.router.navigateByUrl('admin/reseller-raster');
        this.refreshCustomerService.announceCustomerAdded();
      } else if(res?.error?.StatusCode == 306) {
        this.notificationService.showError(res?.error?.Error?.Message[0].ErrorMessage)
      }
      else{
        this.notificationService.showError(res?.error?.Error?.Data);
      }
    })
  }

  cancel(event: any) {
    event.preventDefault()
    this.resellerForm.reset()
  }

}
