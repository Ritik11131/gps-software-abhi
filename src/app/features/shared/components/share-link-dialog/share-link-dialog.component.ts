import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '../../user/services/user.service';
import { NotificationService } from '../../../http-services/notification.service';

@Component({
  selector: 'app-share-link-dialog',
  templateUrl: './share-link-dialog.component.html',
  styleUrls: ['./share-link-dialog.component.scss']
})
export class ShareLinkDialogComponent implements OnInit {
  deviceId: any;
  vehicleNo: string = '';
  hours: number = 2;
  shareLink: string = '';
  isGenerating: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  generateLink() {
    if (!this.hours || this.hours < 1) {
      this.notificationService.showError('Please enter valid hours (minimum 1)');
      return;
    }

    this.isGenerating = true;
    const validTill = new Date();
    validTill.setHours(validTill.getHours() + this.hours);

    const payload = {
      DeviceId: this.deviceId,
      validTill: validTill.toISOString()
    };

    this.userService.createShareUrl(payload).subscribe(
      (res: any) => {
        const path = res?.body?.data || res?.data;
        if (path) {
          this.shareLink = `${window.location.origin}${path}`;
        } else {
          this.notificationService.showError('Failed to generate share link');
        }
        this.isGenerating = false;
      },
      (err: any) => {
        this.notificationService.showError('Failed to generate share link');
        this.isGenerating = false;
      }
    );
  }

  copyLink() {
    if (!this.shareLink) return;
    navigator.clipboard.writeText(this.shareLink).then(() => {
      this.notificationService.showInfo('Link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this tracking link:', this.shareLink);
    });
  }

  openLink() {
    if (!this.shareLink) return;
    window.open(this.shareLink, '_blank');
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
