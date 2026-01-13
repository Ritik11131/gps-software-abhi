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
  confirmationType: string = 'password'; // 'password' or 'delete'
  @Output() mapdata = new EventEmitter<string>();
  userDetail: any;
  validateMessage: any;
  showPassword:boolean = false
  deleteText: string = '';

  constructor(
    private bsmodalservice: BsModalService,
    private dashboardService: AdminDashboardService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    // confirmationType is set via modal initialState
    // Default to 'password' if not provided
    if (!this.confirmationType || this.confirmationType === undefined) {
      this.confirmationType = 'password';
    }
    
    if (this.confirmationType === 'password') {
      this.getUserDetail()
    } else if (this.confirmationType === 'delete') {
      // Initialize for delete mode
      this.validateMessage = 'Please type DELETE to confirm';
    }
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

  onDeleteTextChange(event: any) {
    this.deleteText = event?.target?.value || '';
    if (this.deleteText.trim().toUpperCase() === 'DELETE') {
      this.validateMessage = 'Success';
    } else if (this.deleteText.trim().length === 0) {
      this.validateMessage = 'Please type DELETE to confirm';
    } else {
      this.validateMessage = 'Please type DELETE exactly (case-insensitive) to confirm';
    }
  }

  searchData(event: any) {
    if (this.confirmationType === 'delete') {
      this.onDeleteTextChange(event);
      return;
    }
    
    // Original password validation logic
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
