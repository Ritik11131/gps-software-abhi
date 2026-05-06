import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DeviceManageService } from '../../../service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-update-recharge',
  templateUrl: './update-recharge.component.html',
  styleUrls: ['./update-recharge.component.scss']
})
export class UpdateRechargeComponent implements OnInit {
  deviceId: any;
  vehicleNo: string = '';
  customerRechargeDate: Date | null = null;
  isSubmitting: boolean = false;
  bsConfig = { dateInputFormat: 'DD/MM/YYYY' };

  constructor(
    public bsModalRef: BsModalRef,
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService,
    private refreshCustomerService: RefreshCustomerService
  ) {}

  ngOnInit(): void {}

  submit() {
    if (!this.customerRechargeDate) {
      this.notificationService.showError('Please select a date');
      return;
    }

    const dateStr = formatDate(this.customerRechargeDate, 'yyyy-MM-dd', 'en-US');
    const payload = {
      fkDeviceId: this.deviceId,
      CustomerRechargeDate: dateStr,
      NextRechargeDate: dateStr
    };

    this.isSubmitting = true;
    this.deviceManageService.updateRecharge(payload, this.deviceId).subscribe((res: any) => {
      this.isSubmitting = false;
      if (res?.status === 200 || res?.result === true || res?.body?.result === true) {
        const msg = res?.body?.data || res?.data || 'Validity applied on device';
        this.notificationService.showSuccess(msg);
        this.refreshCustomerService.announceCustomerAdded();
        this.bsModalRef.hide();
      } else {
        const errMsg = res?.error?.message || res?.error?.Error?.Message || 'Failed to update recharge';
        this.notificationService.showError(errMsg);
      }
    });
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
