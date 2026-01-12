import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent {
  @Input() deviceValue: any
  @Output() closePopup = new EventEmitter();
  selectedDealer: any
  spinnerLoading: boolean = false
  rechargeData: any;

  constructor(
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
   
    if (this.deviceValue){
      this.getRechargeDetail()
    }
      
  }

  submit() {
    let payload = {
      "DeviceId": this.deviceValue?.Device?.Id,
      "DealerId": this.deviceValue?.Dealer?.Id
    }
    this.deviceManageService.activatePoint(payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.closePopup.emit(false)
        this.notificationService.showSuccess(res?.body?.Result?.Message);
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }

  getRechargeDetail() {
    this.spinnerLoading = true
    this.deviceManageService.getRechargeValidity(this.deviceValue?.Device?.Id).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200) {
        this.spinnerLoading = false;
        this.rechargeData = res?.body?.Result?.Data
      } else {
        this.rechargeData = []
      }
    })
  }

  cancel() {
    this.closePopup.emit(false)
  }
}
