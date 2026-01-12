import { Component, ViewChild } from '@angular/core';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { SubUserService } from 'src/app/features/admin/sub-user/sub-user-manage/services/sub-user.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { MoveSelectDeviceOverviewComponent } from '../move-select-device-overview/move-select-device-overview.component';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.scss']
})
export class MoveComponent {
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer:any
  dealerId: any;
  customerId: any;
  deviceId: any;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger | any;
  columns:any
  deviceData: any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [25, 50, 100];
  urlPath= [
    {name: 'Move Device'}
  ];
  bsmodal!: BsModalRef
  selectDevice: any;
  selectDealerCustomer: any;

  constructor( 
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private notificationService: NotificationService,
    private refreshCustomerService: RefreshCustomerService,
    private deviceManageService: DeviceManageService,
  private subUserService: SubUserService,
  private bsmodalService: BsModalService,
  private storageService: StorageService
){}

  ngOnInit(){
    this.getDealerlist();
    this.setInitialValue();
    this.checkDealerCustomer()
    this.refreshCustomerService.customerAdded$.subscribe(() => {
      this.getDealerlist();
   });
  }
  setInitialValue() {
    this.columns = [
      { key: 'Device Id', title: 'Device Id' },
      { key: 'Device', title: 'Device' },
      { key: 'Action', title: 'Action' },
    ]
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
    this.selectedCustomer = null;
    this.selectDealerCustomer = null;
    this.getCustomerData(dealerId);
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    this.deviceData = []
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.customerData[0].Id;
        this.getDeviceList(this.selectedCustomer)
      }
    });
  }

  onCustomerSelect(customerId:any) {
    this.selectedCustomer = customerId; 
    this.getDeviceList(this.selectedCustomer)
   
  }

  submit() {
    let payload = {
      "DeviceId": Number(this.deviceId),
      "OldCustomerId": Number(this.customerId),
      "NewCustomerId": this.selectedCustomer
    }

    this.deviceManageService.moveDevice(payload).subscribe((res: any) => {
      if(res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
    })
  }
  cancel(event:any) {
    event.preventDefault()
  }

  getDeviceList(id:any) {
    this.subUserService.customerDevice(this.selectedDealerId, id).subscribe((res: any) => {
      if (res?.status == 200) {
        this.deviceData = res?.body?.Result?.Data;       
      } else {
        this.deviceData = []
      }
    })
  }

  onTableDataChange(event: any) {
    this.page = event;
  };

  onContextMenu(event: MouseEvent, item: any, i: any): void {
    this.selectDevice = item;    
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  openMoveDevice() {
    const initialState: ModalOptions = {
      initialState: {
        dealerId: this.selectedDealerId,
        customerId: this.selectedCustomer,
        deviceId: this.selectDevice?.Id,
        deviceName: this.selectDevice?.DeviceType?.Name

      },
    };
    this.bsmodal = this.bsmodalService.show(
      MoveSelectDeviceOverviewComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

}
