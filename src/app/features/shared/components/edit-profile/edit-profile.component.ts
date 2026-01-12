import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AdminProfileService } from 'src/app/features/admin/profile/profile-manage/services/admin-profile.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  user: any;
  userForm! : FormGroup

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private bsModalService: BsModalService,
    private adminProfileService: AdminProfileService,
    private notificationService: NotificationService
  ) {}
  ngOnInit() {
    this.setInitialValue()
    this.getAdminData();
  }
  
  setInitialValue () {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('')]],
      orgName : ['', [Validators.required, Validators.pattern('')]],
      email: ['', [Validators.required, Validators.email]],
      phn : ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      add: ['', [Validators.required, Validators.pattern('')]],
    })
  }

  getAdminData() {
    this.profileService.getProfile().subscribe((res:any) => {
      this.user = res?.body?.Result?.Data;
      this.userForm = this.fb.group({
        name: [this.user?.Name, [Validators.required, Validators.pattern('')]],
        orgName : [this.user?.OrgName, [Validators.required, Validators.pattern('')]],
        email: [this.user?.EmailId, [Validators.required, Validators.email]],
        phn : [this.user?.MobileNo, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        add: [this.user?.Address, [Validators.required, Validators.pattern('')]],
      })
    })
  }


  submit(formvalue:any){
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    let payload ={
      "Id": this.user?.Id,
      "DealerType": this.user?.DealerType,
      "Address": formvalue.add,
      "EmailId": formvalue.email,
      "LoginId": this.user?.LoginId,
      "Name": formvalue.name,
      "MobileNo": formvalue.phn,
      "OrgName": formvalue.orgName,
      "Password": this.user?.Password,
      "ParentId": this.user?.ParentId
  }
  
    this.adminProfileService.updateAdminProfile(payload, this.user?.Id).subscribe((res:any) => {
      if(res?.body?.ResponseMessage == "Success") {
        this.notificationService.showSuccess(res.body?.Result?.Data)
        this.bsModalService.hide()
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
      
    })
  }

  cancel() {
    this.bsModalService.hide()
  }
}
