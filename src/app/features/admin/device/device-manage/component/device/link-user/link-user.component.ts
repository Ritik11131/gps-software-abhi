import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SubUserService } from 'src/app/features/admin/sub-user/sub-user-manage/services/sub-user.service';
import { DeviceManageService } from '../../../service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'app-link-user',
  templateUrl: './link-user.component.html',
  styleUrls: ['./link-user.component.scss']
})
export class LinkUserComponent {
  @Input() deviceId: number = 0;
  @Output() mapdata = new EventEmitter<any>();
  
  userList: any[] = [];
  selectedUserIds: number[] = [];
  spinnerLoading: boolean = false;
  isLoadingUsers: boolean = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;

  constructor(
    private bsmodalservice: BsModalService,
    private subUserService: SubUserService,
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    this.isLoadingUsers = true;
    this.subUserService.userList(null, null).subscribe((res: any) => {
      this.isLoadingUsers = false;
      if (res?.status === 200 && res?.body?.result === true) {
        // Filter users with userType 1 (Dealer) or 2 (Customer)
        this.userList = (res?.body?.data || []).filter((item: any) => 
          item.userType === 1 || item.userType === 2
        );
        this.count = this.userList.length;
      } else {
        this.userList = [];
        this.count = 0;
      }
    }, (error: any) => {
      this.isLoadingUsers = false;
      this.userList = [];
    });
  }

  onUserSelect(event: any, userId: number) {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.selectedUserIds.includes(userId)) {
        this.selectedUserIds.push(userId);
      }
    } else {
      const index = this.selectedUserIds.findIndex(id => id === userId);
      if (index !== -1) {
        this.selectedUserIds.splice(index, 1);
      }
    }
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUserIds.includes(userId);
  }

  selectAllUsers(event: any) {
    const isChecked = event.target.checked;
    // Get users on current page
    const startIndex = (this.page - 1) * this.tableSize;
    const endIndex = startIndex + this.tableSize;
    const currentPageUsers = this.userList.slice(startIndex, endIndex).map(user => user.id);
    
    if (isChecked) {
      // Select all users from the current page
      currentPageUsers.forEach(userId => {
        if (!this.selectedUserIds.includes(userId)) {
          this.selectedUserIds.push(userId);
        }
      });
    } else {
      // Deselect all users from the current page
      this.selectedUserIds = this.selectedUserIds.filter(id => !currentPageUsers.includes(id));
    }
  }

  isAllCurrentPageSelected(): boolean {
    const startIndex = (this.page - 1) * this.tableSize;
    const endIndex = startIndex + this.tableSize;
    const currentPageUsers = this.userList.slice(startIndex, endIndex);
    if (currentPageUsers.length === 0) return false;
    return currentPageUsers.every(user => this.selectedUserIds.includes(user.id));
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  submit() {
    if (this.selectedUserIds.length === 0) {
      this.notificationService.showError('Please select at least one user');
      return;
    }

    if (!this.deviceId) {
      this.notificationService.showError('Device ID is required');
      return;
    }

    const payload = {
      userId: this.selectedUserIds,
      deviceId: this.deviceId
    };

    this.spinnerLoading = true;
    this.deviceManageService.createDeviceMapping(payload).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status === 200 || res?.status === 201) {
        if (res?.body?.result === true) {
          this.notificationService.showSuccess('Users linked to device successfully');
          this.mapdata.emit({ success: true, data: res?.body?.data });
          this.bsmodalservice.hide();
        } else {
          const errorMsg = res?.body?.data || res?.body?.message || 'Failed to link users';
          this.notificationService.showError(errorMsg);
        }
      } else {
        const errorMsg = res?.error?.message || res?.body?.message || 'Failed to link users';
        this.notificationService.showError(errorMsg);
      }
    }, (error: any) => {
      this.spinnerLoading = false;
      const errorMsg = error?.error?.message || error?.error?.data || error?.message || 'Failed to link users';
      this.notificationService.showError(errorMsg);
    });
  }

  cancel() {
    this.bsmodalservice.hide();
  }
}

