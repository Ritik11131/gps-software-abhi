import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerManageService } from '../../../serices/customer-manage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modify-customer',
  templateUrl: './modify-customer.component.html',
  styleUrls: ['./modify-customer.component.scss']
})
export class ModifyCustomerComponent {
  showPassword: boolean = false
  dealerId: any;
  customerId: any;
  customerForm!: FormGroup
  customerData: any;
  customer: any;
  routePath:any = 'admin/customer/customer-manage'
  role = [
    { id: 2, title: 'Reseller/Dealer' },
    { id: 4, title: 'Customer' },
  ]
  statusData = [{ id: 0, staus: 'Active' }, { id: 1, staus: 'Inactive' }];
  duplicateLoginId: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private customerService: CustomerManageService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('cusID');
      this.getCustomerDetails()
    });
  }

  ngOnInit() {
    this.setInitialValue();
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("cusID")

    if (this.dealerId && this.customerId) {
      this.getCustomerDetails()
    }
  }

  setInitialValue() {
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.pattern('')]],
      userName: ['', [Validators.required, Validators.pattern('')]],
      password: ['', [Validators.required, Validators.pattern('')]],
      email: ['', [Validators.required, Validators.email]],
      phn: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      Address: [''],
      status: [null, [Validators.required]],
    })
  }

  getLoginId(serachvalue: any) {
    if (this.customerData?.User?.LoginId === serachvalue) {
      this.duplicateLoginId = false;
      return;
    }
    let params = {
      "id":serachvalue
    }
    this.customerService.duplicateLoginId(params).subscribe((res: any) => {
      this.duplicateLoginId = res?.Result?.DuplicateCustomerLoginId      
    })
  }

  getCustomerDetails() {
    this.customerService.getCoustomer(this.dealerId, this.customerId).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData) {
        console.log("this.customerData", this.customerData);
        
        this.customerForm = this.fb.group({
          customerName: [this.customerData?.CustomerName, [Validators.required, Validators.pattern('')]],
          userName: [this.customerData?.User?.LoginId, [Validators.required, Validators.pattern('')]],
          password: [this.customerData?.User?.Password, [Validators.required, Validators.pattern('')]],
          email: [this.customerData?.Email, [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
          phn: [this.customerData?.ContactNumber, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
          Address: [this.customerData?.Address],
          status: [this.customerData?.User?.IsActive, [Validators.required, Validators.pattern('')]],
        })
        if (this.customerForm.get('userName')) {
          this.customerForm.get('userName')!.valueChanges.subscribe((value: any) => {
            this.getLoginId(value)
          });
        }
      }
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit(formvalue: any) {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    let payload = {
      "Id": Number(this.customerId),
      "DealerId": Number(this.dealerId),
      "CustomerName": formvalue.customerName,
      "User": {
        "Id": Number(this.customerData?.User?.Id),
        "CustomerId": Number(this.customerId),
        "LoginId": formvalue?.userName,
        "Password": formvalue?.password,
        "MobileNo": null,
        "Type": 1,
        "Reseller": {
          "Id": Number(this.dealerId)
        }
      },
      "Email": formvalue?.email,
      "ContactNumber": formvalue?.phn,
      "Address": formvalue?.Address
    }
    this.customerService.updateCustomer(Number(this.customerId), payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == "Success") {
        this.customer = res?.body?.Result?.Data;
        this.updateCustomerUserDetails(formvalue)
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })

  }

  updateCustomerUserDetails(formvalue: any) {
    let payload = {
      "Id": Number(this.customerData?.User?.Id),
      "CustomerId": Number(this.customerId),
      "LoginId": formvalue?.userName,
      "Password": formvalue?.password,
      "MobileNo": formvalue?.phn,
      "Type": 1,
      "Emailid" : formvalue.email,
      "IsActive": formvalue.status,
      "Reseller": {
        "Id": this.dealerId
      }
    }

    this.customerService.updateCustomerUser(Number(this.customerData?.User?.Id), payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == "Success") {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.customerForm.reset();
        this.router.navigateByUrl('admin/customer/customer-manage')
        this.refreshCustomerService.announceCustomerAdded();
      } else if (res?.error.ResponseMessage == "Failed") {
        this.notificationService.showError(res?.error?.Error?.Message[0]?.ErrorMessage)
      }
    })
  }

  cancel(event:any) {
    event.preventDefault()
    this.customerForm.reset()
  }
}
