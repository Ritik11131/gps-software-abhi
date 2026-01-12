import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AdminProfileService } from 'src/app/features/admin/profile/profile-manage/services/admin-profile.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changeForm!: FormGroup | any;
  loginUser: any;
  showReTypePassword:boolean = false
  showNewPassword:boolean = false
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private adminProfileService: AdminProfileService,
    private bsModalService: BsModalService
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
          this.notificationService.showSuccess(res?.body?.Result?.Data)
          this.bsModalService.hide()
        } else {
          this.notificationService.showError(res?.error?.Error?.Data)
        }
      })
    }
  }

  cancel() {
    this.bsModalService.hide()
  }
}
