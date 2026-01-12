import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { SubUserService } from 'src/app/features/admin/sub-user/sub-user-manage/services/sub-user.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshpageService } from 'src/app/features/http-services/refreshpage.service';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { DeviceManageService } from '../../service/device-manage.service';

@Component({
  selector: 'bulk-activated-device',
  templateUrl: './bulk-activated-device.component.html',
  styleUrls: ['./bulk-activated-device.component.scss']
})
export class BulkActivatedDeviceComponent {
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
  bsModelRef!: BsModalRef
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

  constructor(
    private refreshCustomerService: RefreshCustomerService,
    private notificationService: NotificationService,
    private clipboardService: ClipboardService,
    private storageService: StorageService,
    private refreshpage: RefreshpageService,
    private deviceManageService: DeviceManageService
  ) { }

  ngOnInit() {
    this.refreshpage.checkAndRedirect('/admin/device/bulk-activated');

    this.setInitialValue();
    this.refreshCustomerService.customerAdded$.subscribe(() => {
      this.getDeviceList()
    });
  }

  toggleAllRows() {
    this.deviceData?.forEach((row: any) => row.selected = this.selectAll);
    this.updateSelectedRows();
  }

  onRowChange(row: any) {
    if (!row.selected) {
      this.selectAll = false;
    } else {
      this.selectAll = this.deviceData?.every((val: any) => val.selected);
    }
    this.updateSelectedRows();
  }

  updateSelectedRows() {
    if (this.selectAll) {
      this.selectedRows = [...this.deviceData];
    } else {
      this.selectedRows = this.deviceData?.filter((row: any) => row.selected);
    }
  }


  copyContent(text: any, i: any) {
    this.clipboardService.copyFromContent(text)
    this.copy = true
    this.index = i
    this.notificationService.showSuccess('Copied')
  }

  setInitialValue() {
    this.columns = [
      { key: 'selectAll', title: 'Select All', isCheckbox: true },
      { key: 'VehicleNo', title: 'Vehicle No' },
      { key: 'DeviceId', title: 'Device Id' },
      { key: 'MobileNo', title: 'Mobile No' },
      { key: 'Device', title: 'Device' },
      { key: 'Creation Date', title: 'Creation Date' },
      { key: 'Installation', title: 'Installation' },
      { key: 'PointRecharge', title: 'Point Recharge Due' },
      { key: 'Recharge', title: 'Customer Recharge Due' },
      // { key: 'Action', title: 'Action' },
    ];
  }

  ngOnDestroy(): void {
    this.subscription.forEach((val) => {
      val.unsubscribe();
    });
  }

  confirm(event: any) {
    this.selectAll = false;
    this.selectedRows = []
    // if (event?.Type == 'notAllocate') {
    //   this.selectAll = false;
    //   this.selectedRows = []
    // }
    this.selectedDealerId = event?.dealerId;
    this.selectedCustomerId = event?.customerId
    this.statusTypeData = event?.statusType

    this.getDeviceList()
  }

  // getDeviceList() {
  //   this.spinnerLoading = true
  //   this.subUserService.customerDevice(this.selectedDealerId, this.selectedCustomerId).subscribe((res: any) => {
  //     this.spinnerLoading = false;
  //     if (res?.status == 200) {
  //       this.deviceData = res?.body?.Result?.Data
  //     } else {
  //       this.deviceData = []
  //     }
  //   })
  // }

  getDeviceList() {
    this.spinnerLoading = true
    let params = {
      pageno: this.page,
      pagesize: this.tableSize,
      filterType: this.statusTypeData
    }
    this.deviceManageService?.deviceActivated(this.selectedDealerId, this.selectedCustomerId, params)?.subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.StatusCode == 200) {
        this.deviceData = res?.Result?.Data
      } else {
        this.deviceData = []
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
