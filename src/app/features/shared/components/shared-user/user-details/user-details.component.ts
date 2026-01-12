import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerManageService } from 'src/app/features/admin/customer/customer-manage/serices/customer-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  @Input() userData: any
  @Output() closePopup = new EventEmitter();
  showPassword: boolean = false
  customerForm!: FormGroup
  customerData: any;
  customer: any;
  closePage:boolean = false

  constructor(
    private customerService: CustomerManageService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) {

  }

  ngOnInit() {
    this.setInitialValue();
    if (this.userData) {
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
      Address: ['', [Validators.required, Validators.pattern('')]],
    })
  }

  getCustomerDetails() {
    this.customerService.getCoustomer(this.userData?.Dealer?.Id, this.userData?.Customer?.Id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData) {
        this.customerForm = this.fb.group({
          customerName: [this.customerData?.CustomerName, [Validators.required, Validators.pattern('')]],
          userName: [this.customerData?.User?.LoginId, [Validators.required, Validators.pattern('')]],
          password: [this.customerData?.User?.Password, [Validators.required, Validators.pattern('')]],
          email: [this.customerData?.Email, [Validators.required, Validators.email]],
          phn: [this.customerData?.ContactNumber, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
          Address: [this.customerData?.Address, [Validators.required, Validators.pattern('')]],
        })
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
      "Id": Number(this.userData?.Customer?.Id),
      "DealerId": Number(this.userData?.Dealer?.Id),
      "CustomerName": formvalue.customerName,
      "User": {
        "Id": Number(this.customerData?.User?.Id),
        "CustomerId": Number(this.userData?.Customer?.Id),
        "LoginId": formvalue?.userName,
        "Password": formvalue?.password,
        "MobileNo": null,
        "Type": 1,
        "Reseller": {
          "Id": Number(this.userData?.Dealer?.Id)
        }
      },
      "Email": formvalue?.email,
      "ContactNumber": formvalue?.phn,
      "Address": formvalue?.Address
    }
    
    this.customerService.updateCustomer(Number(this.userData?.Customer?.Id), payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == "Success") {
        this.customer = res?.body?.Result?.Data;
        this.closePopup.emit(false)
        this.notificationService.showSuccess(res?.body?.Result?.Message);
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })

  }

  cancel(event: any) {
    this.closePopup.emit(false)
    event.preventDefault()
    this.customerForm.reset()
    this.getCustomerDetails()
  }
}
