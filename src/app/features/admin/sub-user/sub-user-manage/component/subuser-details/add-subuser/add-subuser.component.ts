import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { SubUserService } from '../../../services/sub-user.service';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-subuser',
  templateUrl: './add-subuser.component.html',
  styleUrls: ['./add-subuser.component.scss']
})
export class AddSubuserComponent implements OnDestroy {

  statusData = [{ id: 1, staus: 'Active' }, { id: 0, staus: 'Inactive' }];
  userTypeData = [{ id: 1, name: 'Dealer' }, { id: 2, name: 'Customer' }];
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
  isLoginIdDuplicate: boolean = false;
  isCheckingLoginId: boolean = false;
  selectedCustomer: any;
  private destroy$ = new Subject<void>();
  private loginIdSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService,
    private SubUserService: SubUserService,
    private dashboardService : AdminDashboardService
  ) {
    // Removed paramMap subscription from constructor to avoid duplicate API calls
    // The call will be made only in ngOnInit
   }

  ngOnInit() {
    this.setInitialValue();
    this.setupLoginIdDebounce();
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("cusID");
    this.subUserId = this.activeRoute.snapshot.paramMap.get("subUserId");    
    // Only call getCustomerUser once in ngOnInit if subUserId exists
    if (this.subUserId)  {
      this.getCustomerUser()
    }
    // Commented out - no longer needed since filters are removed
    // if(this.dealerId) {
    //   this.getCustomerData()
    // }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupLoginIdDebounce() {
    this.loginIdSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(loginId => {
      if (loginId && loginId.trim().length > 0) {
        this.validateLoginId(loginId);
      } else {
        this.isLoginIdDuplicate = false;
        this.isCheckingLoginId = false;
      }
    });
  }

  onLoginIdChange(loginId: string) {
    this.isCheckingLoginId = true;
    this.isLoginIdDuplicate = false;
    // Clear duplicate error from form control
    const errors = this.subuserForm.controls['loginId'].errors;
    if (errors && errors['duplicate']) {
      delete errors['duplicate'];
      if (Object.keys(errors).length === 0) {
        this.subuserForm.controls['loginId'].setErrors(null);
      } else {
        this.subuserForm.controls['loginId'].setErrors(errors);
      }
    }
    this.loginIdSubject.next(loginId);
  }

  validateLoginId(loginId: string) {
    const userId = this.subUserId || 0;
    this.SubUserService.validateLoginId(loginId, userId).subscribe((res: any) => {
      this.isCheckingLoginId = false;
      if (res?.status == 200 && res?.body?.result === true) {
        // data: false means loginId is available (not duplicate)
        // data: true means loginId is duplicate
        this.isLoginIdDuplicate = res?.body?.data === true;
        if (this.isLoginIdDuplicate) {
          this.subuserForm.controls['loginId'].setErrors({ duplicate: true });
        } else {
          const errors = this.subuserForm.controls['loginId'].errors;
          if (errors) {
            delete errors['duplicate'];
            if (Object.keys(errors).length === 0) {
              this.subuserForm.controls['loginId'].setErrors(null);
            } else {
              this.subuserForm.controls['loginId'].setErrors(errors);
            }
          }
        }
      }
    });
  }

  // Commented out - no longer needed since filters are removed
  // getCustomerData() {
  //   this.dashboardService.customer(this.dealerId).subscribe((res: any) => {
  //     let cusotmer = res?.body?.Result?.Data;
  //     this.selectedCustomer = cusotmer.find((val:any) => val?.Id == this.customerId)      
  //     if (this.selectedCustomer && !this.subUserId) {
  //       // Pre-fill email from customer data when adding new user
  //       this.subuserForm.controls['email'].patchValue(this.selectedCustomer?.Email || '');
  //     }
  //   });
  // }

  getCustomerUser() {    
    this.buttonValue = 'Update';
    this.labelName = 'Update'
    // Get user by ID using the new API
    this.SubUserService.getUserById(this.subUserId).subscribe((res: any) => {
      if (res?.status == 200 && res?.body?.result === true) {
        this.subUserDataById = res?.body?.data;

        if (this.subUserDataById) {
          this.subuserForm.patchValue({
            loginId: this.subUserDataById?.loginId,
            userName: this.subUserDataById?.userName,
            password: this.subUserDataById?.password || '', // Password is returned from API
            mobileNo: this.subUserDataById?.mobileNo,
            email: this.subUserDataById?.email,
            userType: this.subUserDataById?.userType,
            address: this.subUserDataById?.address || '',
            isActive: this.subUserDataById?.isActive,
          });
        }
      }
    })
  }

  setInitialValue() {
    this.subuserForm = this.fb.group({
      loginId: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      userType: [2, [Validators.required]], // 2 = Customer, 1 = Dealer
      address: [''],
      isActive: [1, [Validators.required]], // 1 = Active in new API format
    })
  }

 

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

 

  submit(formvalue: any) {
    // Check if loginId is duplicate
    if (this.isLoginIdDuplicate) {
      this.notificationService.showError('Login ID is already taken. Please choose a different one.');
      return;
    }

    // Password is required only when adding new user, optional when updating
    if (!this.subUserId && !formvalue.password) {
      this.subuserForm.controls['password'].setErrors({ required: true });
      this.subuserForm.markAllAsTouched();
      return;
    }
    
    if (this.subuserForm.invalid) {
      this.subuserForm.markAllAsTouched();
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    
    // For updates, use existing password if new password is not provided
    const passwordToUse = this.subUserId 
      ? (formvalue.password || this.subUserDataById?.password || '')
      : formvalue.password;
    
    let payload: any = {
      "id": this.subUserId || 0,
      "loginId": formvalue.loginId,
      "fkParentId": this.subUserId ? this.subUserDataById?.fkParentId : 0,
      "fkCustomerId": this.subUserId ? this.subUserDataById?.fkCustomerId : (this.customerId ? Number(this.customerId) : 0),
      "userName": formvalue.userName,
      "email": formvalue.email,
      "password": passwordToUse,
      "mobileNo": formvalue.mobileNo,
      "userType": formvalue.userType,
      "address": formvalue.address || '',
      "userCategory": null,
      "timezone": this.subUserId ? this.subUserDataById?.timezone : "Asia/Calcutta",
      "creationTime": this.subUserId ? this.subUserDataById?.creationTime : currentTime,
      "lastUpdateOn": currentTime,
      "isActive": formvalue.isActive
    }

    this.spinnerLoading = true;
    
    // Use PUT for update, POST for create
    const serviceCall = this.subUserId 
      ? this.SubUserService.updateUser(this.subUserId, payload)
      : this.SubUserService.addUser(payload);
    
    serviceCall.subscribe((res: any) => {
      this.spinnerLoading = false;
      // Handle new response format
      if (res?.body?.result === true) {
        this.createUser = res?.body?.data;
        const message = 'User ' + (this.subUserId ? 'updated' : 'created') + ' successfully';
        this.notificationService.showSuccess(message);
        this.subuserForm.reset();
        this.router.navigateByUrl('admin/subuser/customer-sub-user');
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        const errorMsg = res?.error?.message || res?.body?.message || 'An error occurred';
        this.notificationService.showError(errorMsg);
      }
    }, (error: any) => {
      this.spinnerLoading = false;
      const errorMsg = error?.error?.message || error?.message || 'An error occurred';
      this.notificationService.showError(errorMsg);
    });
  }

  cancel(e:any) {
    e.preventDefault()
    this.subuserForm.reset();
  }
}
