import { Component } from '@angular/core';
import { SubUserService } from '../../../services/sub-user.service';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
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
  deviceData: any[] = [];
  selectedDevice: any = [];
  subUserId: any;
  selectedDeviceData: any;
  routePath: any = 'admin/subuser/customer-sub-user';
  deviceLoading = false;

  constructor(
    private subUserService: SubUserService,
    private deviceManageService: DeviceManageService,
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
    this.subUserService.selectedDevice(this.subUserId).subscribe((res: any) => {
      this.selectedDeviceData = res?.body?.Result?.Data || [];
      this.selectedDevice = (this.selectedDeviceData || []).map((e: any) => e.Id ?? e.id);
    });
  }

  /** Load devices for dropdown: try customer devices first, fallback to full device list from device module */
  getDeviceData() {
    this.deviceLoading = true;
    const hasDealerCustomer = this.dealerId != null && this.customerId != null &&
      this.dealerId !== '' && this.customerId !== '' && Number(this.dealerId) !== 0 && Number(this.customerId) !== 0;

    if (hasDealerCustomer) {
      this.subUserService.customerDevice(this.dealerId, this.customerId).subscribe((res: any) => {
        if (res?.body?.ResponseMessage === 'Success' && res?.body?.Result?.Data?.length) {
          this.deviceData = res.body.Result.Data;
          this.deviceLoading = false;
        } else {
          this.loadDeviceListFromDeviceModule();
        }
      }, () => this.loadDeviceListFromDeviceModule());
    } else {
      this.loadDeviceListFromDeviceModule();
    }
  }

  private loadDeviceListFromDeviceModule() {
    this.deviceManageService.getDeviceList().subscribe((res: any) => {
      this.deviceLoading = false;
      if (res?.status === 200 && res?.body?.result === true && res?.body?.data?.length) {
        this.deviceData = res.body.data;
      } else {
        this.deviceData = [];
      }
    }, () => {
      this.deviceLoading = false;
      this.deviceData = [];
    });
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
