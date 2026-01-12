import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DeviceManageService } from '../../../service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { Router } from '@angular/router';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-activate-point',
  templateUrl: './activate-point.component.html',
  styleUrls: ['./activate-point.component.scss']
})
export class ActivatePointComponent {
  selectedDealer: any
  selectedCustomer: any
  vehicleNo: any
  tittle: any
  deviceId: any;
  spinnerLoading: boolean = false
  type:any

  constructor( private deviceManageService: DeviceManageService,
    private notificationService: NotificationService,
    private router: Router,
    private bsmodelService: BsModalService,
    private refreshCustomerService: RefreshCustomerService
  ){}

  ngOnInit(){

  }

  submit(){
    let payload = {
      "DeviceId": this.deviceId,
      "DealerId": this.selectedDealer
  }
    this.deviceManageService.activatePoint(payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        if(this.type == 'Admin'){
          this.router.navigateByUrl('admin/dashboard')
        }else{
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
