import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DeviceManageService } from '../../../service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-fill-odometer',
  templateUrl: './fill-odometer.component.html',
  styleUrls: ['./fill-odometer.component.scss']
})
export class FillOdometerComponent {
  selectedvalue: any
  deviceId: any
  constructor(
     private bsmodelService: BsModalService,
     private deviceManageService: DeviceManageService,
     private notificationService: NotificationService,
     private refreshCustomerService: RefreshCustomerService,
    //  private router: Router,
    ) { }

  ngOnInit() {
}

  submit() {
    let payload = {
      "DeviceId": this.deviceId,
      "Odo": Number(this.selectedvalue) 
    }

    this.deviceManageService.modifiedOdometer(payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Data);
        // this.router.navigateByUrl('admin/device/device-manage')
        this.bsmodelService.hide();
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })

  }

  cancel() {
    this.bsmodelService.hide();
  }
}
