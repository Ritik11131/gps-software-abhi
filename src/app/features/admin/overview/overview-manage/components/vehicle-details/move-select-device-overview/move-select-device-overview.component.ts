import { Component } from '@angular/core';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-move-select-device-overview',
  templateUrl: './move-select-device-overview.component.html',
  styleUrls: ['./move-select-device-overview.component.scss']
})
export class MoveSelectDeviceOverviewComponent {
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer: any
  dealerId: any;
  customerId: any;
  deviceId: any;
  routePath: any = 'admin/device/device-manage'
  deviceName: any
  activateData: any
  activateType: any
  constructor(
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private notificationService: NotificationService,
    private refreshCustomerService: RefreshCustomerService,
    private deviceManageService: DeviceManageService,
    private bsmodalService: BsModalService
  ) {

  }
  ngOnInit() {
    this.getDealerlist();

  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.dealerData[0].Id;
        this.getCustomerData(this.selectedDealer);
      }
    })
  }
  onDealerSelect(dealerId: any) {
    this.getCustomerData(dealerId);
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.customerData[0].Id;
      }
    });
  }

  onCustomerSelect(customerId: any) {
    this.selectedCustomer = customerId;
  }

  submitMoveDevice() {

    if (this.activateType == 'Move-data') {
      this.bulkMoveDevice()
    } else {
      this.submit()
    }
  }

  bulkMoveDevice() {

    this.dealerData?.forEach((val: any) => {
      if (this.selectedDealerId == val?.Id) {
        this.activateData?.forEach((value: any) => {
          this.moveDevice(value)
        })
      }
    })
  }

  moveDevice(device: any) {
    let payload = {
      "DeviceId": Number(device?.Id),
      "OldCustomerId": Number(this.customerId),
      "NewCustomerId": this.selectedCustomer
    }
    console.log("payload", payload);
    this.deviceManageService.moveDevice(payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.bsmodalService.hide()
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
    })
  }


  submit() {
    if(!this.selectedDealer || !this.selectedCustomer) {
      return;
    }
    let payload = {
      "DeviceId": Number(this.deviceId),
      "OldCustomerId": Number(this.customerId),
      "NewCustomerId": this.selectedCustomer
    }

    this.deviceManageService.moveDevice(payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.bsmodalService.hide()
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
    })
  }

  cancel(event: any) {
    event.preventDefault();
    this.bsmodalService.hide()

  }

}
