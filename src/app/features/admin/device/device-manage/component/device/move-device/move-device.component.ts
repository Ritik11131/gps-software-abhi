import { Component } from '@angular/core';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { DeviceManageService } from '../../../service/device-manage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'app-move-device',
  templateUrl: './move-device.component.html',
  styleUrls: ['./move-device.component.scss']
})
export class MoveDeviceComponent {
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer:any
  dealerId: any;
  customerId: any;
  deviceId: any;
  routePath: any = 'admin/device/device-manage'
  selectDealerCustomer: any;
  constructor(
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private notificationService: NotificationService,
    private refreshCustomerService: RefreshCustomerService,
    private deviceManageService: DeviceManageService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('CustomerId');
      this.deviceId = params.get('deviceId')
    });
  }
  ngOnInit() {
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("CustomerId");
    this.deviceId = this.activeRoute.snapshot.paramMap.get('deviceId');
    this.getDealerlist()
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
        this.selectedCustomer = this.selectDealerCustomer  && this.selectDealerCustomer?.customer ? this.selectDealerCustomer?.customer : this.customerData[0].Id;
      }
    });
  }

  onCustomerSelect(customerId:any) {
    this.selectedCustomer = customerId;    
  }

  isSubmitted = false;
  submit() {
    this.isSubmitted = true;
    if(!this.selectedDealerId || !this.selectedCustomer) {
      return;
    }
    let payload = {
      "DeviceId": Number(this.deviceId),
      "OldCustomerId": Number(this.customerId),
      "NewCustomerId": this.selectedCustomer
    }

    this.deviceManageService.moveDevice(payload).subscribe((res: any) => {
      if(res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.router.navigateByUrl('admin/device/device-manage')
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
    })
  }

  cancel(event:any) {
    event.preventDefault()
  }

}
