import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { AdminProfileService } from '../../services/admin-profile.service';

@Component({
  selector: 'app-modify-password',
  templateUrl: './modify-password.component.html',
  styleUrls: ['./modify-password.component.scss']
})
export class ModifyPasswordComponent {
  changeForm!: FormGroup | any;
  showReTypePassword:boolean = false
  showNewPassword:boolean = false
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private adminProfileService: AdminProfileService
  ){}

  ngOnInit(){
this.setInitialValue()
  }

  setInitialValue() {
    this.changeForm = this.fb.group({
      oldPwd: ['', Validators.required],
      newPwd: ['', [Validators.required, Validators.minLength(3)]],
      reNewPwd: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
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

  togglePasswordVisibility(type:any) {
    if(type == 'RETYPE'){
      this.showReTypePassword = !this.showReTypePassword;
    }else if(type == 'NEW'){
      this.showNewPassword = !this.showNewPassword;
    }
  }

  submit(formValue:any) {
    if (this.changeForm.valid) {
      let payload = {
          "oldPassword":formValue?.oldPwd,
          "newPassword": formValue?.newPwd,
          "retypeNewPassword": formValue?.reNewPwd
      }
      this.adminProfileService.modifiedPassword(payload).subscribe((res: any) => {
        if (res?.body?.ResponseMessage == "Success") {
          this.notificationService.showSuccess(res?.body?.Result?.Data)
          this.changeForm.reset();
        } else {
          this.notificationService.showError(res?.error?.Error?.Data)
        }
      })
    }
  }

  cancel(): void {
    this.changeForm.reset();
  }
}
