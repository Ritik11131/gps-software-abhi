import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewService } from 'src/app/features/admin/overview/overview-manage/services/overview.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {
  showPassword: boolean = false;
  dealerData = [{id: 0, staus:'Active'}, {id: 1, staus:'Inactive'} ]
  userForm!: FormGroup
  dealerId: any;
  customerId: any;
  newUser: any;
  routePath:any = 'admin/customer/customer-manage'
  constructor(
    private fb: FormBuilder,
    private overviewService: OverviewService,
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService
  ) { 
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('cusID');
    });
  }

  ngOnInit() {
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("cusID")
    this.setInitialValue()
  }

  setInitialValue() {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern('')]],
      password: ['', [Validators.required, Validators.pattern('')]],
      email: ['', [Validators.required, Validators.email]],
      phn: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      status: [0, [Validators.required, Validators.pattern('')]],
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  cancel(event:any){
    event.preventDefault()
    this.userForm.reset()
  }

  submit(formvalue: any) {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    let payload = {
      "Id": 0,
      "CustomerId": Number(this.customerId),
      "LoginId": formvalue.userName,
      "Password": formvalue.password,
      "MobileNo": formvalue.phn,
      "Emailid": formvalue?.email,
      "Type": 2,
      "IsActive": formvalue.status,
      "Reseller": {
        "Id": Number(this.dealerId) 
      }
    }
    this.overviewService.addCustomerUser(payload).subscribe((res:any) => {
      if(res?.body?.ResponseMessage == "Success") {
        this.newUser = res?.body?.Result?.Data
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.router.navigateByUrl('admin/customer/customer-manage')
        this.refreshCustomerService.announceCustomerAdded();
      }else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }
}
