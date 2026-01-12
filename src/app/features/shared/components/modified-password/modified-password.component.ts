import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminProfileService } from 'src/app/features/admin/profile/profile-manage/services/admin-profile.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'modified-password',
  templateUrl: './modified-password.component.html',
  styleUrls: ['./modified-password.component.scss']
})
export class ModifiedPasswordComponent {
  changeForm!: FormGroup | any;
  loginUser: any;
  showReTypePassword:boolean = false
  showNewPassword:boolean = false
  @Output() closePopup = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private adminProfileService: AdminProfileService,
  ) { }

  ngOnInit() {
    this.loginUser = localStorage.getItem('userName');
    this.setInitialValue()

  }

  setInitialValue() {
    this.changeForm = this.fb.group({
      oldPwd: ['', Validators.required],
      newPwd: ['', [Validators.required, Validators.minLength(3)]],
      reNewPwd: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  togglePasswordVisibility(type:any) {
    if(type == 'RETYPE'){
      this.showReTypePassword = !this.showReTypePassword;
    }else if(type == 'NEW'){
      this.showNewPassword = !this.showNewPassword;
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

  submit(formValue:any) {
    if (this.changeForm.invalid) {
      this.changeForm.markAllAsTouched();
      return;
    }
    if (this.changeForm.valid) {
      let payload = {
        "oldPassword": formValue.oldPwd,
        "newPassword": formValue.newPwd,
        "retypeNewPassword": formValue.reNewPwd
      }
      this.adminProfileService.modifiedPassword(payload).subscribe((res: any) => {
        if (res?.body?.ResponseMessage == "Success") {
          this.closePopup.emit(false)
          this.notificationService.showSuccess(res?.body?.Result?.Data)
        } else {
          this.notificationService.showError(res?.error?.Error?.Data)
        }
      })
    }
  }

  cancel(){
    this.closePopup.emit(false)
    this.changeForm.reset()
  }
}
