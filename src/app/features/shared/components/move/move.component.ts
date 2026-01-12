import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { RefreshCustomerService } from '../../services/refresh-customer.service';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.scss']
})
export class MoveComponent {
  @Input() deviceValue :any
  @Output() closePopup = new EventEmitter();
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer:any
  dealerId: any;
  customerId: any;
  deviceId: any;
  selectDealerCustomer: any;
  constructor( 
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private notificationService: NotificationService,
    private refreshCustomerService: RefreshCustomerService,
    private deviceManageService: DeviceManageService,
    private storageService: StorageService

  ){}

  ngOnInit(){
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
    this.selectedDealer = null
    this.selectedCustomer = null
    this.selectDealerCustomer = null;
    this.getCustomerData(dealerId);
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.selectDealerCustomer && this.selectDealerCustomer?.customer ? this.selectDealerCustomer?.customer : this.customerData[0].Id;
      }
    });
  }

  onCustomerSelect(customerId:any) {
    this.selectedCustomer = customerId;    
  }

  submit() {

    if(!this.selectedDealer || !this.selectedCustomer) {
      return;
    }
    let payload = {
      "DeviceId": Number(this.deviceValue?.Device?.Id),
      "OldCustomerId": Number(this.deviceValue?.Customer?.Id),
      "NewCustomerId": this.selectedCustomer
    }

    this.deviceManageService.moveDevice(payload).subscribe((res: any) => {
      if(res?.body?.ResponseMessage == 'Success') {
        this.closePopup.emit(false)
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
    })
  }
  cancel(event:any) {
    this.closePopup.emit(false)
    event.preventDefault()
  }

}
