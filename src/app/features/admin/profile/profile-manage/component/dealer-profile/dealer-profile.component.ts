import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminProfileService } from '../../services/admin-profile.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'app-dealer-profile',
  templateUrl: './dealer-profile.component.html',
  styleUrls: ['./dealer-profile.component.scss']
})
export class DealerProfileComponent {
  profileForm!: FormGroup | any;
  profileData: any;
constructor( private fb: FormBuilder,
  private adminProfileService:AdminProfileService,
  private notificationService: NotificationService
){}

ngOnInit(){
this.setInitProfile()
this.getProfileDetail()
}

setInitProfile() {
  this.profileForm = this.fb.group({
    name: ['', Validators.required],
    orgName: ['', Validators.required],
    email: ['', Validators.required],
    phn: ['', Validators.required],
    address: ['', Validators.required]
  });
}

getProfileDetail(){
  this.adminProfileService.profileDetail().subscribe((res:any)=>{
    this.profileData = res?.body?.Result?.Data
    this.profileForm = this.fb.group({
      name: [this.profileData?.Name, Validators.required],
      orgName: [this.profileData?.OrgName, Validators.required],
      email: [this.profileData?.EmailId, Validators.required],
      phn: [this.profileData?.MobileNo, Validators.required,],
      address: [this.profileData?.Address, Validators.required]
    });    
  })
}

submitProfile(formValue:any){
  let payload ={
    "Id": this.profileData?.Id,
    "DealerType": this.profileData?.DealerType,
    "Address": formValue?.address,
    "EmailId": formValue?.email,
    "LoginId": this.profileData?.LoginId,
    "Name": formValue?.name,
    "MobileNo": formValue?.phn,
    "OrgName": formValue?.orgName,
    "Password": this.profileData?.Password,
    "ParentId": this.profileData?.ParentId
}

  this.adminProfileService.updateAdminProfile(payload, this.profileData?.Id).subscribe((res:any) => {
    if(res?.body?.ResponseMessage == "Success") {
      this.notificationService.showSuccess(res.body?.Result?.Data)
    } else {
      this.notificationService.showError(res?.error?.Error?.Data)
    }
    
  })
}

cancelProfile(){
this.profileForm.reset()
}
}
