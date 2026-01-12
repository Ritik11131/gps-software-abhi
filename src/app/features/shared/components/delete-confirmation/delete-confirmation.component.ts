import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent {
  title: any;
  content: any;
  primaryActionLabel: any;
  secondaryActionLabel: any;
  service: any
  @Output() mapdata = new EventEmitter<string>();
  userDetail: any;
  validateMessage: any;
  showPassword:boolean = false

  constructor(
    private bsmodalservice: BsModalService,
    private dashboardService: AdminDashboardService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.getUserDetail()
  }

  ok() {
    this.service.subscribe((res: any) => {
      this.mapdata.emit(res)
    })
    this.bsmodalservice.hide()
  }

  getUserDetail() {
    this.storageService.getItem('userDetail').subscribe((res) => {
      this.userDetail = res;      
    });
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword
  }


  searchData(event: any) {
    let payload = {
     "role_id": Number(this.userDetail?.role),
    "user_id": Number(this.userDetail?.dealerId),
    "login_id": this.userDetail?.unique_name,
    "password": event?.target?.value 
    }
    this.dashboardService?.checkUserDetail(payload)?.subscribe((res: any) => {
      this.validateMessage = res?.body?.responseMessage
    })

  }

  cancel() {
    this.bsmodalservice.hide()
  }
}
