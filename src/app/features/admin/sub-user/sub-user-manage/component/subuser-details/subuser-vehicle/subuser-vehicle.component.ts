import { Component } from '@angular/core';
import { SubUserService } from '../../../services/sub-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-subuser-vehicle',
  templateUrl: './subuser-vehicle.component.html',
  styleUrls: ['./subuser-vehicle.component.scss']
})
export class SubuserVehicleComponent {
  dealerId: any;
  customerId: any;
  deviceData: any;
  selectedDevice: any = []
  subUserId: any;
  selectedDeviceData: any;
  routePath:any = 'admin/subuser/customer-sub-user'

  constructor(
    private subUserService: SubUserService,
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('cusID');
      this.subUserId = params.get("subUserId");
      this.getDeviceData()
      if (this.subUserId) {
        this.getSelectedDevice()
      }
    });
   }

  ngOnInit() {
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("cusID");
    this.subUserId = this.activeRoute.snapshot.paramMap.get("subUserId");
    if(this.subUserId){
      this.getSelectedDevice()
    }
    this.getDeviceData()
  }

  selectDevice(event: any) {
    this.selectedDevice = event;
  }

  getSelectedDevice() {
    this.subUserService.selectedDevice(this.subUserId).subscribe((res:any) => {
      this.selectedDeviceData = res?.body?.Result?.Data;
      this.selectedDevice = this.selectedDeviceData.map((e:any) => e.Id)
    })
  }

  getDeviceData() {
    this.subUserService.customerDevice(this.dealerId, this.customerId).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == "Success") {
        this.deviceData = res?.body?.Result?.Data
      } else {
        this.deviceData = []
      }
    })
  }

  submit() {
    let payload = {
      "UserId": Number(this.subUserId),
      "DeviceId": this.selectedDevice
    }

    this.subUserService.deviceMapping(payload).subscribe((res: any) => {
      if(res?.body?.StatusCode == 200) {
        this.notificationService.showSuccess(res?.body?.Result?.Data);
        this.router.navigateByUrl('admin/subuser/customer-sub-user')
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error.Error?.Message)

      }
    })
  }

  cancel() {
    this.router.navigateByUrl('admin/subuser/customer-sub-user')
  }
}
