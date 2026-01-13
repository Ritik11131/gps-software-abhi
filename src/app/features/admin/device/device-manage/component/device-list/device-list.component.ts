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
import { LinkUserComponent } from '../device/link-user/link-user.component';


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
      name: 'Update',
      path: 'update-device',
    },
    {
      name: 'Link User',
      path: 'link-user',
    },
    {
      name: 'Delete Device',
      path: 'delete-device',
    },
    // Commented out - keeping only Update and Delete
    // {
    //   name: 'Device Details',
    //   path: 'device-details'
    // },
    // {
    //   name: 'Advance Settings',
    //   path: 'advance-settings',
    // },
    // {
    //   name: 'Recharge Point',
    //   path: 'recharge-point',
    // },
    // {
    //   name: 'Modify Recharge Due',
    //   path: 'modify',
    // },
    // {
    //   name: 'Move Device ',
    //   path: 'move',
    // },
  ];

  // Commented out - fitment actions
  // fitmentUrlPath = [
  //   {
  //     name: 'Create ',
  //     path: 'create-fitment',
  //   },
  //   {
  //     name: 'Delete',
  //     path: 'delete-fitment',
  //   },
  //   {
  //     name: 'Show ',
  //     path: 'show-fitment',
  //   },
  // ]
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
    // Call getDeviceList by default when page loads
    this.getDeviceList();
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

  // Commented out - no longer using filter dropdowns
  // confirm(event: any) {
  //   this.selectedDealerId = event?.dealerId;
  //   this.selectedCustomerId = event?.customerId
  //   this.getDeviceList()
  // }

  getDeviceList() {
    this.spinnerLoading = true
    // Use new API to get all devices
    this.deviceManageService.getDeviceList().subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200 && res?.body?.result === true) {
        this.deviceData = res?.body?.data || []
        this.count = this.deviceData.length;
      } else {
        this.deviceData = []
        this.count = 0;
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
      return; // Return early for delete
    } else if (path == 'update-device') {
      // Use device ID directly for update - route format: :id/:CustomerId/:deviceId/add-device
      const deviceId = this.selectedDeviceValue.id || this.selectedDeviceValue.Id;
      url = `/admin/device/device-manage/0/0/${deviceId}/add-device`;
    } else if (path == 'link-user') {
      // Open modal to link users to device
      this.linkUserToDevice(this.selectedDeviceValue);
      return;
    } else if (path == 'recharge-point') {
      url = `/admin/device/device-manage`
      this.getRechargeDetail(this.selectedDeviceValue)
      return;
    } else if (path == 'activate-point') {
      url = `/admin/device/device-manage`
      this.activatePoint(this.selectedDeviceValue)
      return;
    } else if (path == 'modify') {
      url = `/admin/device/device-manage`
      this.modifiedRecharge(this.selectedDeviceValue)
      return;
    } else if (path == 'create-fitment') {
      url = `/admin/device/device-manage/0/0/${this.selectedDeviceValue.id || this.selectedDeviceValue.Id}/${path}`;
    } else if (path == 'delete-fitment') {
      url = `/admin/device/device-manage`
      this.deleteFitment(this.selectedDeviceValue)
      return;
    } else if (path == 'show-fitment') {
      url = `/admin/device/device-manage`
      this.showFitmentDetails(this.selectedDeviceValue)
      return;
    } else {
      // For other paths, use device ID
      url = `/admin/device/device-manage/0/0/${this.selectedDeviceValue.id || this.selectedDeviceValue.Id}/${path}`;
    }

    // Don't call announceCustomerAdded() when navigating - only call it after successful save/update
    this.router.navigateByUrl(url);
  }

  addDevice(event: any) {
    let url: any;
    if (event == 'add-device') {
      this.selectedDeviceValue = null;
      this.selectColor = null;
      // Route requires :id/:cusID parameters, using 0 as default since filters are removed
      url = `/admin/device/device-manage/0/0/${event}`
    } else if (event == 'bulk-upload') {
      url = `/admin/device/${event}`
    }

    // Don't call announceCustomerAdded() when navigating - only call it after successful save/update
    this.router.navigateByUrl(url);
  }

  getRechargeDetail(device: any) {
    this.spinnerLoading = true
    // Use new API structure - device.id instead of device.Id
    this.deviceManageService.getRechargeValidity(device.id || device.Id).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200) {
        this.spinnerLoading = false;
        this.rechargeData = res?.body?.Result?.Data
        const initialState: ModalOptions = {
          initialState: {
            selectedDealer: this.selectedDealerId,
            selectedCustomer: this.selectedCustomerId,
            deviceId: device?.deviceId || device?.DeviceId,
            Id: device?.id || device?.Id,
            vehicleNo: device?.vehicleNo || device?.VehicleNo,
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
        deviceId: device?.id || device?.Id,
        vehicleNo: device?.vehicleNo || device?.VehicleNo,
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
        deviceId: device?.id || device?.Id,
        Id: device?.validity?.id || device?.PointValidity?.Id,
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
    // Use new deleteDevice API
    let deleteService = this.deviceManageService.deleteDevice(device?.id);
    const initialState: ModalOptions = {
      initialState: {
        title: `Delete Device: ${device?.deviceId || device?.deviceImei}`,
        content: 'Are you sure you want to delete this device? This action cannot be undone.',
        primaryActionLabel: 'Delete',
        secondaryActionLabel: 'Cancel',
        service: deleteService,
        confirmationType: 'delete' // Use DELETE typing confirmation
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
        // Delete API doesn't return a response body - if no error, show success
        if (value?.error) {
          // Error case - show error message
          const errorMsg = value?.error?.message || value?.error?.Error?.Message || 'Failed to delete device';
          this.notificationService.showError(errorMsg);
        } else {
          // Success - no response body, just show success message
          this.refreshCustomerService.announceCustomerAdded();
          this.notificationService.showSuccess('Device deleted successfully');
        }
      },
      (error: any) => {
        // Handle subscription error
        const errorMsg = error?.error?.message || error?.message || 'Failed to delete device';
        this.notificationService.showError(errorMsg);
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
    // Use new API structure - device.id instead of device.Id
    this.deviceManageService.getFitmentDetail(device.id || device.Id).subscribe((res: any) => {
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
    // Use new API structure
    let url = this.deviceManageService.deleteDeviceFitement(device?.id || device?.Id)
    const initialState: ModalOptions = {
      initialState: {
        title: device?.deviceId || device?.DeviceId,
        content: `Are you sure to delete the fitment for this device ${device?.vehicleNo || device?.VehicleNo}?`,
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

  linkUserToDevice(device: any) {
    const deviceId = device?.id || device?.Id;
    if (!deviceId) {
      this.notificationService.showError('Device ID is required');
      return;
    }

    const initialState: ModalOptions = {
      initialState: {
        deviceId: deviceId
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      LinkUserComponent,
      Object.assign(initialState, {
        id: "link-user",
        class: "modal-lg modal-dialog-centered",
      })
    );

    this.bsModelRef?.content.mapdata.subscribe(
      (value: any) => {
        if (value?.success === true) {
          this.refreshCustomerService.announceCustomerAdded();
        }
      }
    );
  }
}
