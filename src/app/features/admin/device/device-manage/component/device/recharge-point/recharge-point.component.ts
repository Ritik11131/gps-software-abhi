import { Component } from '@angular/core';
import { DeviceManageService } from '../../../service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-recharge-point',
  templateUrl: './recharge-point.component.html',
  styleUrls: ['./recharge-point.component.scss']
})
export class RechargePointComponent {
  selectedDealer: any
  selectedCustomer: any
  vehicleNo: any
  tittle: any
  deviceId: any;
  spinnerLoading: boolean = false
  rechargeData: any;
  Id: any;
  type:any

  constructor(
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService,
    private router: Router,
    private bsmodelService: BsModalService,
    private refreshCustomerService: RefreshCustomerService
  ) { }

  ngONinit() {

  }

  submit() {
    let payload = {
      "DeviceId": this.Id,
      "DealerId": this.selectedDealer
    }
    this.deviceManageService.activatePoint(payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        if(this.type != 'admin') {
          this.router.navigateByUrl('admin/device/device-manage')
        }
        this.bsmodelService.hide();
        this.refreshCustomerService.announceCustomerAdded();

      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }

  cancel() {
    this.bsmodelService.hide()
  }

}
