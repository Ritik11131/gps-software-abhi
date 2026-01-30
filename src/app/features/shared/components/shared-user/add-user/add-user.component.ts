import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverviewService } from 'src/app/features/admin/overview/overview-manage/services/overview.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  @Input() userData: any
  @Output() closePopup = new EventEmitter();
  showPassword: boolean = false;
  dealerData = [{id: 1, staus:'Active'}, {id: 0, staus:'Inactive'} ]
  userForm!: FormGroup
  newUser: any;
  constructor(
    private fb: FormBuilder,
    private overviewService: OverviewService,
    private notificationService: NotificationService,
  ) { 
  }

  ngOnInit() {
    this.setInitialValue()
  }

  setInitialValue() {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern('')]],
      password: ['Abc@123', [Validators.required, Validators.pattern('')]],
      phn: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      status: [1, [Validators.required, Validators.pattern('')]],
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  cancel(event:any){
    this.closePopup.emit(false)
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
      "CustomerId": Number(this.userData?.Customer?.Id),
      "LoginId": formvalue.userName,
      "Password": formvalue.password,
      "MobileNo": formvalue.phn,
      "Type": 2,
      "IsActive": formvalue.status,
      "Reseller": {
        "Id": Number(this.userData?.Dealer?.Id) 
      }
    }
    this.overviewService.addCustomerUser(payload).subscribe((res:any) => {
      if(res?.body?.ResponseMessage == "Success") {
        this.newUser = res?.body?.Result?.Data
        this.closePopup.emit(false)
        this.notificationService.showSuccess(res?.body?.Result?.Message);
      }
    })
  }
}
