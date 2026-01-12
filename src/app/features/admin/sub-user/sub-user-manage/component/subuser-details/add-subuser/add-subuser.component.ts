import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewService } from 'src/app/features/admin/overview/overview-manage/services/overview.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { SubUserService } from '../../../services/sub-user.service';
import { CustomerManageService } from 'src/app/features/admin/customer/customer-manage/serices/customer-manage.service';
import { AdminDashboardComponent } from 'src/app/features/admin/dashboard/dashboard-manage/pages/admin-dashboard/admin-dashboard.component';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';

@Component({
  selector: 'app-add-subuser',
  templateUrl: './add-subuser.component.html',
  styleUrls: ['./add-subuser.component.scss']
})
export class AddSubuserComponent {

  statusData = [{ id: 0, staus: 'Active' }, { id: 1, staus: 'Inactive' }];
  showPassword: boolean = false;
  subuserForm!: FormGroup;
  dealerId: any;
  customerId: any;
  createUser: any;
  subUserId: any;
  buttonValue: string = 'Add'
  subUserDataById: any;
  labelName: string= 'Add';
  spinnerLoading: boolean = false;
  routePath:any = 'admin/subuser/customer-sub-user'
  duplicateSubUser: any;
  selectedCustomer: any;

  constructor(
    private fb: FormBuilder,
    private overviewService: OverviewService,
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService,
    private SubUserService: SubUserService,
    private CustomerManageService: CustomerManageService,
    private dashboardService : AdminDashboardService
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('cusID');
      this.subUserId = params.get("subUserId");

      if (this.dealerId && this.subUserId && this.subUserId) {
        this.getCustomerUser()
      }
    });
   }

  ngOnInit() {
    this.setInitialValue();
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("cusID");
    this.subUserId = this.activeRoute.snapshot.paramMap.get("subUserId");    
    if (this.dealerId && this.subUserId && this.subUserId)  {
      this.getCustomerUser()
    }
    if(this.dealerId) {
      this.getCustomerData()

    }
  }

  getCustomerData() {
    this.dashboardService.customer(this.dealerId).subscribe((res: any) => {
      let cusotmer = res?.body?.Result?.Data;
      this.selectedCustomer = cusotmer.find((val:any) => val?.Id == this.customerId)      
      if (this.selectedCustomer) {
        this.subuserForm.controls['email'].patchValue(this.selectedCustomer?.Email)
      }
      
    });
  }

  getCustomerUser() {    
    this.buttonValue = 'Update';
    this.labelName = 'Modify'
    this.SubUserService.customerUser(this.customerId, this.subUserId).subscribe((res: any) => {
      this.subUserDataById = res?.body?.Result?.Data;

      this.subuserForm = this.fb.group({
        userName: [this.subUserDataById?.LoginId, [Validators.required]],
        password: [this.subUserDataById?.Password, [Validators.required]],
        phn: [this.subUserDataById?.MobileNo, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        status: [this.subUserDataById?.IsActive, [Validators.required]],
        email: [this.subUserDataById?.Emailid, [Validators.required, Validators.email]],
      })
    })
  }

  getSubUserName(serachvalue:any) {    
    this.SubUserService.duplicateSubUser(serachvalue).subscribe((res: any) => {
      this.duplicateSubUser = res?.body?.Result.Data
    })
  }

  searchData(event:any) {
    this.getSubUserName(event.target.value)
  }

  setInitialValue() {
    this.subuserForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phn: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      status: [0, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    })
  }

 

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

 

  submit(formvalue: any) {
    if (this.subuserForm.invalid) {
      this.subuserForm.markAllAsTouched();
      return;
    }
    let payload = {
      "Id": 0,
      "CustomerId": Number(this.customerId),
      "LoginId": formvalue.userName,
      "Password": formvalue.password,
      "MobileNo": formvalue.phn,
      "Type": 2,
      "IsActive": formvalue.status,
      "Emailid" : formvalue.email,
      "Reseller": {
        "Id": Number(this.dealerId)
      }
    }
    let service = this.overviewService.addCustomerUser(payload)
    if(this.subUserId){
      payload['Id'] = this.subUserDataById.Id;
      service = this.CustomerManageService.updateCustomerUser( this.subUserId,payload)
    }
    
    service.subscribe((res: any) => {
      if (res?.body?.ResponseMessage == "Success") {
        this.createUser = res?.body?.Result?.Data;
        this.notificationService.showSuccess(res?.body?.Result?.Message)
        this.subuserForm.reset();
        this.router.navigateByUrl('admin/subuser/customer-sub-user')
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error.Error?.Message)
      }
    })
  }

  cancel(e:any) {
    e.preventDefault()
    this.subuserForm.reset();
  }
}
