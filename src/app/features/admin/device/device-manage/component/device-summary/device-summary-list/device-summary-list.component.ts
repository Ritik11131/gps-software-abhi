import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshpageService } from 'src/app/features/http-services/refreshpage.service';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { DeviceManageService } from '../../../service/device-manage.service';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';

@Component({
  selector: 'app-device-summary-list',
  templateUrl: './device-summary-list.component.html',
  styleUrls: ['./device-summary-list.component.scss']
})
export class DeviceSummaryListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedDealerId: any;
  selectedCustomerId: any;
  spinnerLoading: boolean = false
  subUserData: any;
  columns: any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [25, 50, 100];
  deviceData: any;
  rechargeData: any;
  contextMenuPosition = { x: '0px', y: '0px' };
  showCopyIcon: any

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger | any;
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  subscription: Subscription[] = [];
  @Output() clickOutside = new EventEmitter<void>();
  selectedDeviceValue: any;
  copy: boolean = false;
  index: any;
  selectColor: any;
  fitmentDetail: any;
  statusTypeData: any;
  selectAll = false;
  selectedRows: any;
  expiredCount: any;
  expiredSoon: any;
  resellerValue: any;
  type: any;
  userDetail: any;
  selectDealer: any;

  constructor(
    private refreshCustomerService: RefreshCustomerService,
    private notificationService: NotificationService,
    private clipboardService: ClipboardService,
    private storageService: StorageService,
    private refreshpage: RefreshpageService,
    private deviceManageService: DeviceManageService,
  ) { }

  ngOnInit() {
    this.refreshpage.checkAndRedirect('/admin/device/device-summary');
    this.getUserDetail()
    this.setInitialValue();
  }

  getUserDetail() {
    this.storageService.getItem("userDetail").subscribe((res: any) => {
      this.userDetail = res;
      this.selectDealer = this.userDetail?.dealerId
    });
  }


  copyContent(text: any, i: any) {
    this.clipboardService.copyFromContent(text)
    this.copy = true
    this.index = i
    this.notificationService.showSuccess('Copied')
  }

  setInitialValue() {
    this.columns = [
      // { key: '', title: 'Status' },
      { key: '', title: 'Customer' },
      { key: '', title: 'Mobile No.' },
      { key: '', title: 'Installation' },
      { key: '', title: 'Point Recharge' },
      { key: '', title: 'Customer Recharge' },
      { key: '', title: 'Vehicle No' },
      { key: '', title: 'type' },
      { key: '', title: 'DeviceId' },
      { key: '', title: 'IMEI' },
      { key: '', title: 'SIM Phone' },
      { key: '', title: 'Last Update' },
    ]
  }

  ngOnDestroy(): void {
    this.subscription.forEach((val) => {
      val.unsubscribe();
    });
  }

  confirm(event: any) {
    this.selectedDealerId = event?.dealerId;
    this.selectedCustomerId = event?.customerId
    this.statusTypeData = event?.statusType
    if (event?.type == 'ResetData') {
      this.resellerValue = []
    }else{
      this.getSelectResellerOverview(event?.value, event?.statusType)
    }
  }
  getSelectResellerOverview(statusId: any, type: any) {    
    this.spinnerLoading = true
    this.type = type;
    this.page = 1;
    this.deviceManageService.selectDeviceSummary(this.selectedDealerId, statusId).subscribe((res: any) => {
      this.spinnerLoading = false;
      let data = res?.body?.Result?.Data;
      this.expiredCount = data?.filter((res: any) => res?.isexpired === 1);
      this.expiredSoon = data?.filter((res: any) => res?.isexpiredsoon === 1);
      if (type == 'Expire_Soon') {
        this.resellerValue = this.expiredSoon;
      } else if (type == 'epired') {
        this.resellerValue = this.expiredCount;
      } else {
        this.resellerValue = data;        
      }
    })
  }

  /**
  * table data change
  * @param event 
  */
  onTableDataChange(event: any) {
    this.page = event;
  };

  onContextMenu(event: MouseEvent, item: any, i: any): void {
    this.selectedDeviceValue = item;
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

}
