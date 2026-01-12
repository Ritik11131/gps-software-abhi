import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  changeForm!: FormGroup | any;
  profileForm!: FormGroup | any;
  dealerDetails: any;
  customerDetails: any;

  constructor(
    private fb: FormBuilder,
    private profileSercie: ProfileService,
    private notificationService: NotificationService
  ) { };

  ngOnInit(): void {
    this.getDealerDetails();
    this.getCustomerDetails()
    this.setInitialValue();
    this.setInitProfile()
  }

  setInitialValue() {
    this.changeForm = this.fb.group({
      oldPwd: ['', Validators.required],
      newPwd: ['', [Validators.required, Validators.minLength(3)]],
      reNewPwd: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  setInitProfile() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
      phn: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required]
    });
  }

  submit() {
    if (this.changeForm.valid) {
      let payload = {
        "Password": this.changeForm.value.oldPwd,
        "NewPassword": this.changeForm.value.newPwd
      }
      this.profileSercie.changePassword(payload).subscribe((res: any) => {
        if (res?.body?.ResponseMessage == "Success") {
          this.notificationService.showSuccess(res?.body?.Result?.Data)
        } else {
          this.notificationService.showError(res?.error?.Error?.Data)
        }
      })
    } 
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPwdControl: any = formGroup.get('newPwd');
    const reNewPwdControl: any = formGroup.get('reNewPwd');

    if (newPwdControl.value !== reNewPwdControl.value) {
      reNewPwdControl.setErrors({ passwordMismatch: true });
    } else {
      reNewPwdControl.setErrors(null);
    }
  }

  cancel(): void {
    this.changeForm.reset();
  }

  getDealerDetails() {
    this.profileSercie.dealerDetails().subscribe((res: any) => {
      this.dealerDetails = res?.body?.Result?.Data
    })
  }

  getCustomerDetails() {
    this.profileSercie.customerDetails().subscribe((res: any) => {
      this.customerDetails = res?.body?.Result?.Data;      
      this.profileForm = this.fb.group({
        name: [this.customerDetails?.CustomerName, Validators.required],
        email: [this.customerDetails?.Email, [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
        phn: [this.customerDetails?.contact, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        address: [this.customerDetails?.Address, Validators.required]
      })
    })
  }

  submitProfile() {
    let payload = {
      "customerId": this.customerDetails?.customerId,
      "userId": this.customerDetails?.userId,
      "customerName": this.profileForm?.value?.name,
      "emailId": this.profileForm?.value?.email,
      "mobile": this.profileForm?.value?.phn,
      "address": this.profileForm?.value?.address
    }

    this.profileSercie.updateProfile(payload, this.customerDetails?.customerId).subscribe((res:any) => {
      if(res?.body?.ResponseMessage == "Success") {
        this.notificationService.showSuccess(res.body?.Result?.Data)
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
      
    })
  }

  cancelProfile() {
    this.profileForm.reset()
  }
}
