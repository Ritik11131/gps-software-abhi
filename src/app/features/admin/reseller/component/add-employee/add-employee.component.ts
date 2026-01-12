import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { ResellerService } from '../../service/reseller.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {
  showPassword: boolean = false;
  employeeForm!: FormGroup;
  resellerData: any;
  selectedDealerId: any;
  resllerById: any;
  routePath: any = 'admin/reseller-raster'
  employetypeData = [
    { id: 0, text: 'Operator' },
    { id: 1, text: 'Admin' }
  ]
  statusData = [
    { id: 1, text: 'Active' },
    { id: 2, text: 'In-Active' }
  ]

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
      this.getResellerByid()
    }
  }


  getResellerByid() {
    this.resellerService.getResellerById(this.selectedDealerId).subscribe((res: any) => {
      this.resllerById = res?.body?.Result?.Data;
      this.employeeForm = this.fb.group({
        name: [res?.body?.Result?.Data?.Name, [Validators.required]],
        orgName: [res?.body?.Result?.Data?.OrgName, [Validators.required]],
        empType: [0, [Validators.required]],
        empName: ['', [Validators.required]],
        loginId: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        pwd: ['', [Validators.required, Validators.pattern('')]],
        Address: [''],
        status: [1, [Validators.required]],
        phn: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
      })

    })
  }

  setInitialValue() {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      orgName: ['', [Validators.required]],
      empName: ['', [Validators.required]],
      empType: [0, [Validators.required]],
      loginId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required, Validators.pattern('')]],
      Address: [''],
      status: [1, [Validators.required]],
      phn: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit(formvalue: any) {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    let payload = {
      "Id": 0,
      "DealerId": this.selectedDealerId,
      "EmployeeType": formvalue.empType,
      "EmployeeName": formvalue.empName,
      "Address": formvalue.Address,
      "ContactNumber": formvalue.phn,
      "EmailId": formvalue.email,
      "LoginId":formvalue.loginId,
      "Password": formvalue.pwd,
      "IsActive":formvalue.status
    }

    this.resellerService.addEmployee(payload).subscribe((res: any) => {      
      this.resellerData = res?.body?.Result;
      if (res?.body?.ResponseMessage == "Success") {
        this.notificationService.showSuccess(this.resellerData?.Message);
        this.router.navigateByUrl('admin/reseller-raster');
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Message[0].ErrorMessage)
      }
    })
  }

  cancel(event: any) {
    event.preventDefault()
    this.employeeForm.reset()
  }
}
