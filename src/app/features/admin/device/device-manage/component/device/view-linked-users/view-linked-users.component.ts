import { Component, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DeviceManageService } from '../../../service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { UnlinkConfirmModalComponent } from '../unlink-confirm-modal/unlink-confirm-modal.component';

@Component({
  selector: 'app-view-linked-users',
  templateUrl: './view-linked-users.component.html',
  styleUrls: ['./view-linked-users.component.scss']
})
export class ViewLinkedUsersComponent {
  @Input() deviceId: number = 0;
  @Input() deviceLabel: string = '';
  linkedUsers: any[] = [];
  loading = false;
  unlinkingId: number | null = null;

  constructor(
    public bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadLinkedUsers();
  }

  loadLinkedUsers() {
    if (!this.deviceId) {
      this.notificationService.showError('Device ID is required');
      return;
    }
    this.loading = true;
    this.deviceManageService.getLinkedUsersByDeviceId(this.deviceId).subscribe((res: any) => {
      this.loading = false;
      const result = res?.body?.result ?? res?.result;
      const data = res?.body?.data ?? res?.data;
      if (result === true && Array.isArray(data)) {
        this.linkedUsers = data;
      } else {
        this.linkedUsers = [];
      }
    }, () => {
      this.loading = false;
      this.linkedUsers = [];
      this.notificationService.showError('Failed to load linked users');
    });
  }

  getUserTypeLabel(userType: number): string {
    return userType === 1 ? 'Dealer' : userType === 2 ? 'Customer' : 'N/A';
  }

  /** Opens unlink confirmation modal; on confirm, calls API and updates list */
  unlinkUser(user: any) {
    const mappingId = user?.mappingId ?? user?.mapping_id;
    const userId = user?.userId ?? user?.user_id;
    if (!mappingId || !userId || !this.deviceId) {
      this.notificationService.showError('Missing data to unlink user');
      return;
    }

    const modalRef = this.bsModalService.show(UnlinkConfirmModalComponent, {
      initialState: {
        user,
        deviceLabel: this.deviceLabel
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true
    });

    if (modalRef?.content?.mapdata) {
      modalRef.content.mapdata.subscribe((result: any) => {
        if (result?.confirmed === true && result?.user) {
          this.performUnlink(result.user);
        }
      });
    }
  }

  private performUnlink(user: any) {
    const mappingId = user?.mappingId ?? user?.mapping_id;
    const userId = user?.userId ?? user?.user_id;
    const deviceId = this.deviceId;

    this.unlinkingId = userId;
    const payload = { mappingId, deviceId, userId };

    this.deviceManageService.unlinkMapping(payload).subscribe((res: any) => {
      this.unlinkingId = null;
      const success = res?.body?.result ?? res?.result ?? (res?.status === 200 || res?.status === 201);
      if (success) {
        this.notificationService.showSuccess('User unlinked successfully');
        this.loadLinkedUsers();
      } else {
        const msg = res?.body?.message ?? res?.body?.data ?? res?.error?.message ?? 'Failed to unlink user';
        this.notificationService.showError(typeof msg === 'string' ? msg : 'Failed to unlink user');
      }
    }, () => {
      this.unlinkingId = null;
      this.notificationService.showError('Failed to unlink user');
    });
  }

  close() {
    this.bsModalRef.hide();
  }
}
