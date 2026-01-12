import { Component } from '@angular/core';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { SubUserService } from 'src/app/features/admin/sub-user/sub-user-manage/services/sub-user.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RechargePointComponent } from 'src/app/features/admin/device/device-manage/component/device/recharge-point/recharge-point.component';
import { ModifiedRechargeComponent } from 'src/app/features/admin/device/device-manage/component/device/modified-recharge/modified-recharge.component';
import { StorageService } from 'src/app/features/http-services/storage.service';
@Component({
  selector: 'app-expire-day',
  templateUrl: './expire-day.component.html',
  styleUrls: ['./expire-day.component.scss']
})
export class ExpireDayComponent {
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer: any;
  selectDevice: any;
  dealerId: any;
  customerId: any;
  deviceId: any;
  deviceData: any;
  spinnerLoading: boolean = false;
  rechargeData: any;
  bsModelRef!: BsModalRef
  selectDeviceDetails: any;
  selectDealerCustomer: any;
  constructor(
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private subUserService: SubUserService,
    private deviceManageService: DeviceManageService,
    private bsmodelService: BsModalService,
    private refreshCustomerService: RefreshCustomerService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.getDealerlist()

    this.refreshCustomerService.customerAdded$.subscribe(() => {
      this.getDealerlist()
    });

    this.checkDealerCustomer()
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res:any) => {
      this.selectDealerCustomer = res
    })
  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer: this.dealerData[0].Id;
        this.getCustomerData(this.selectedDealerId);
      }
    })
  }
  onDealerSelect(dealerId: any) {
    this.selectedCustomer = null;
    this.selectedDealerId = null;
    this.selectDealerCustomer = null;
    this.selectDevice = null;
    this.getCustomerData(dealerId);
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.customerData[0].Id;

        this.getDeviceList(this.selectedCustomer)
      }
    });
  }

  getDeviceList(id: any) {
    this.subUserService.customerDevice(this.selectedDealerId, id).subscribe((res: any) => {
      if (res?.status == 200) {
        this.deviceData = res?.body?.Result?.Data;
        if (this.deviceData && this.deviceData.length > 0) {
          this.selectDevice = this.deviceData[0].Id;
          this.selectDeviceDetails = this.deviceData.find((e: any) => this.selectDevice == e.Id);
        }
      } else {
        this.deviceData = [];
      }
    })
  }

  onCustomerSelect(customerId: any) {
    this.selectedCustomer = null;
    this.selectDevice = null;
    this.selectedCustomer = customerId;
    this.getDeviceList(this.selectedCustomer)


  }

  onDeviceSelect(event: any) {
    this.selectDevice = null;
    this.selectDeviceDetails = this.deviceData.find((e: any) => event == e.Id);
  }

  onRechargeDevice() {
    if(!this.selectedDealerId || !this.selectedCustomer || !this.selectDevice) {
      return;
    } 
    const initialState: ModalOptions = {
      initialState: {
        selectedDealer: this.selectedDealerId,
        selectedCustomer: this.selectedCustomer,
        deviceId: this.selectDeviceDetails?.DeviceId,
        Id: this.selectDeviceDetails?.Id,
        deviceData: this.selectDeviceDetails,
        tittle: 'Device Validity',
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      ModifiedRechargeComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }


}
