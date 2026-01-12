import { Component, ElementRef, EventEmitter, Host, HostListener, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DeleteConfirmationComponent } from 'src/app/features/shared/components/delete-confirmation/delete-confirmation.component';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { SubUserService } from 'src/app/features/admin/sub-user/sub-user-manage/services/sub-user.service';
import { DeviceManageService } from '../../service/device-manage.service';
import { RechargePointComponent } from '../device/recharge-point/recharge-point.component';
import { ActivatePointComponent } from '../device/activate-point/activate-point.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { FocusKeyManager, FocusableOption } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';
import { ClipboardService } from 'ngx-clipboard';
import { ModifiedRechargeComponent } from '../device/modified-recharge/modified-recharge.component';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { ShowFitmentComponent } from '../device/show-fitment/show-fitment.component';
import { RefreshpageService } from 'src/app/features/http-services/refreshpage.service';


@Component({
  selector: 'device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent {
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
  urlPath = [
    {
      name: 'Device Details',
      path: 'device-details'
    },
    {
      name: 'Advance Settings',
      path: 'advance-settings',
    },
    {
      name: 'Recharge Point',
      path: 'recharge-point',
    },
    {
      name: 'Modify Recharge Due',
      path: 'modify',
    },
    {
      name: 'Delete Device',
      path: 'delete-device',
    },
    {
      name: 'Move Device ',
      path: 'move',
    },

  ];

  fitmentUrlPath = [
    {
      name: 'Create ',
      path: 'create-fitment',
    },
    {
      name: 'Delete',
      path: 'delete-fitment',
    },
    {
      name: 'Show ',
      path: 'show-fitment',
    },
  ]
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

  constructor(
    private subUserService: SubUserService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService,
    private bsmodelService: BsModalService,
    private notificationService: NotificationService,
    private deviceManageService: DeviceManageService,
    private elementRef: ElementRef,
    private clipboardService: ClipboardService,
    private storageService: StorageService,
    private refreshpage: RefreshpageService
  ) { }

  ngOnInit() {
    this.refreshpage.checkAndRedirect('/admin/device/device-manage');

    this.getuserDetail()
    this.setInitialValue();
    this.refreshCustomerService.customerAdded$.subscribe(() => {
      this.getDeviceList()
    });
  }

  getuserDetail() {
    this.storageService.getItem("userDetail").subscribe((value: any) => {
      if (value?.role === "2") {
        this.urlPath = this.urlPath.filter(item => item.name !== 'Delete Device');
      }
    })
  }

  copyContent(text: any, i: any) {
    this.clipboardService.copyFromContent(text)
    this.copy = true
    this.index = i
    this.notificationService.showSuccess('Copied')
  }

  setInitialValue() {
    this.columns = [
      { key: 'Vehicle No', title: 'Vehicle No' },
      { key: 'Device Id', title: 'Device Id' },
      { key: 'Mobile No', title: 'Mobile No' },
      { key: 'Device', title: 'Device' },
      { key: 'Creation Date', title: 'Creation Date' },
      { key: 'Installation', title: 'Installation' },
      { key: 'Point Recharge', title: 'Point Recharge Due' },
      { key: 'Recharge', title: 'Customer Recharge Due' },
      { key: 'Action', title: 'Action' },
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

    this.getDeviceList()
  }

  getDeviceList() {
    this.spinnerLoading = true
    this.subUserService.customerDevice(this.selectedDealerId, this.selectedCustomerId).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200) {
        this.deviceData = res?.body?.Result?.Data
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

  toggleDropdown(event: Event) {
    const target = event.currentTarget as HTMLElement;
    const dropdownContent = target.nextElementSibling;
    const allDropdowns = document.querySelectorAll('.dropdown-content');

    allDropdowns.forEach(dropdown => {
      if (dropdown !== dropdownContent && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
    });

    if (dropdownContent) {
      dropdownContent.classList.toggle('show');
    }

    window.onclick = function (event: any) {
      if (!event.target.matches('.fa.fa-ellipsis-v')) {
        allDropdowns.forEach(dropdown => {
          if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
          }
        });
      }
    };
  }

  redirectTo(path: any) {
    let url: any;
    this.selectColor = this.selectedDeviceValue

    if (path == 'delete-device') {
      this.selectColor = null;
      url = `/admin/device/device-manage`
      this.deletDevice(this.selectedDeviceValue)
    } else if (path == 'recharge-point') {
      url = `/admin/device/device-manage`
      this.getRechargeDetail(this.selectedDeviceValue)
    } else if (path == 'activate-point') {
      url = `/admin/device/device-manage`
      this.activatePoint(this.selectedDeviceValue)
    } else if (path == 'modify') {
      url = `/admin/device/device-manage`
      this.modifiedRecharge(this.selectedDeviceValue)
    } else if (path == 'create-fitment') {
      url = `/admin/device/device-manage/${this.selectedDealerId}/${this.selectedDeviceValue.CustomerId}/${this.selectedDeviceValue.Id}/${path}`;
    } else if (path == 'delete-fitment') {
      url = `/admin/device/device-manage`
      this.deleteFitment(this.selectedDeviceValue)
    } else if (path == 'show-fitment') {
      url = `/admin/device/device-manage`
      this.showFitmentDetails(this.selectedDeviceValue)
    } else {
      url = `/admin/device/device-manage/${this.selectedDealerId}/${this.selectedDeviceValue.CustomerId}/${this.selectedDeviceValue.Id}/${path}`;
    }

    this.router.navigateByUrl(url);
    this.refreshCustomerService.announceCustomerAdded();

  }

  addDevice(event: any) {
    let url: any;
    if (event == 'add-device') {
      this.selectedDeviceValue = null;
      this.selectColor = null;
      url = `/admin/device/device-manage/${this.selectedDealerId}/${this.selectedCustomerId}/${event}`
    } else if (event == 'bulk-upload') {
      url = `/admin/device/${event}`
    }

    this.router.navigateByUrl(url);
  }

  getRechargeDetail(device: any) {
    this.spinnerLoading = true
    this.deviceManageService.getRechargeValidity(device.Id).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200) {
        this.spinnerLoading = false;
        this.rechargeData = res?.body?.Result?.Data
        const initialState: ModalOptions = {
          initialState: {
            selectedDealer: this.selectedDealerId,
            selectedCustomer: this.selectedCustomerId,
            deviceId: device?.DeviceId,
            Id: device?.Id,
            vehicleNo: device?.VehicleNo,
            tittle: 'Apply Point',
            rechargeData: this.rechargeData
          },
        };
        this.bsModelRef = this.bsmodelService.show(
          RechargePointComponent,
          Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
        );

      } else {
        this.rechargeData = []
      }
    })
  }

  activatePoint(device: any) {
    const initialState: ModalOptions = {
      initialState: {
        selectedDealer: this.selectedDealerId,
        selectedCustomer: this.selectedCustomerId,
        deviceId: device?.Id,
        vehicleNo: device?.VehicleNo,
        tittle: 'Apply Point',
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      ActivatePointComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

  modifiedRecharge(device: any) {
    const initialState: ModalOptions = {
      initialState: {
        selectedDealer: this.selectedDealerId,
        selectedCustomer: this.selectedCustomerId,
        deviceId: device?.Id,
        Id: device?.PointValidity?.Id,
        deviceData: device,
        tittle: 'Device Validity',
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      ModifiedRechargeComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

  deletDevice(device: any) {
    let url = this.deviceManageService.deleteDeviceManage(this.selectedDealerId, this.selectedCustomerId, device?.Id)
    const initialState: ModalOptions = {
      initialState: {
        title: device?.DeviceId,
        content: 'Are you sure you want to delete?',
        primaryActionLabel: 'Delete',
        secondaryActionLabel: 'Cancel',
        service: url
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      DeleteConfirmationComponent,
      Object.assign(initialState, {
        id: "confirmation",
        class: "modal-md modal-dialog-centered",
      })
    );

    this.bsModelRef?.content.mapdata.subscribe(
      (value: any) => {
        if (value?.body?.ResponseMessage == 'Success') {
          this.refreshCustomerService.announceCustomerAdded();
          this.notificationService.showSuccess(value?.body?.Result?.Data)
        } else {
          this.notificationService.showError(value?.error.Error?.Message)
        }
      }
    );
  }

  onContextMenu(event: MouseEvent, item: any, i: any): void {
    this.selectedDeviceValue = item;
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  showFitmentDetails(device: any) {
    this.spinnerLoading = true
    this.deviceManageService.getFitmentDetail(device.Id).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200) {
        this.fitmentDetail = res?.body?.Result?.Data
        const initialState: ModalOptions = {
          initialState: {
            // selectDeviceId: device?.Id,
            fitmentData: this.fitmentDetail
          },
        };
        this.bsModelRef = this.bsmodelService.show(
          ShowFitmentComponent,
          Object.assign(initialState, {
            id: "confirmation",
            class: "modal-lg modal-dialog-centered",
          })
        );
      }
    })

  }

  deleteFitment(device: any) {
    let url = this.deviceManageService.deleteDeviceFitement(device?.Id)
    const initialState: ModalOptions = {
      initialState: {
        title: device?.DeviceId,
        content: `Are you sure to delete the fitment for this device ${device?.VehicleNo}?`,
        primaryActionLabel: 'Delete',
        secondaryActionLabel: 'Cancel',
        service: url
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      DeleteConfirmationComponent,
      Object.assign(initialState, {
        id: "confirmation",
        class: "modal-md modal-dialog-centered",
      })
    );

    this.bsModelRef?.content.mapdata.subscribe(
      (value: any) => {
        if (value?.body?.ResponseMessage == 'Success') {
          this.refreshCustomerService.announceCustomerAdded();
          this.notificationService.showSuccess(value?.body?.Result?.Message)
        } else {
          this.notificationService.showError(value?.error.Error?.Message)
        }
      }
    );
  }

}
