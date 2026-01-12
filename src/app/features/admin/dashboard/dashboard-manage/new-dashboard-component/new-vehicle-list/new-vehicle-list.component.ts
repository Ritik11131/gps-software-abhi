import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AllCustomerDetailsComponent } from '../../component/all-customer-details/all-customer-details.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
import { DeviceDetailsComponent } from 'src/app/features/admin/device/device-manage/component/device/device-details/device-details.component';
import { DeleteConfirmationComponent } from 'src/app/features/shared/components/delete-confirmation/delete-confirmation.component';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { ModifiedRechargeComponent } from 'src/app/features/admin/device/device-manage/component/device/modified-recharge/modified-recharge.component';
import { RechargePointComponent } from 'src/app/features/admin/device/device-manage/component/device/recharge-point/recharge-point.component';
import { CommonService } from 'src/app/features/shared/services/common.service';
import { BalancePointComponent } from '../balance-point/balance-point.component';
import { AdminProfileService } from 'src/app/features/admin/profile/profile-manage/services/admin-profile.service';
import { ActivatePointComponent } from 'src/app/features/admin/device/device-manage/component/device/activate-point/activate-point.component';
import { MoveSelectDeviceOverviewComponent } from 'src/app/features/admin/overview/overview-manage/components/vehicle-details/move-select-device-overview/move-select-device-overview.component';
import { AdvanceSettingComponent } from 'src/app/features/admin/device/device-manage/component/device/advance-setting/advance-setting.component';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'new-vehicle-list',
  templateUrl: './new-vehicle-list.component.html',
  styleUrls: ['./new-vehicle-list.component.scss']
})
export class NewVehicleListComponent {
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger | any;
  @Output() onSelectCustomer = new EventEmitter();
  @Input() vehicleData: any;
  @Input() vehicleDatacount: any;
  @Output() selectVehicle = new EventEmitter();
  @Output() selectVehicleConfirm = new EventEmitter();

  dealerData: any;
  selectedDealer: any;
  customerData: any;
  selectedCustomer: any;
  selectDealerName: any;
  showContent: boolean = true;
  bsModelRef!: BsModalRef
  selectedVehicleValue: any;
  contextMenuPosition = { x: '0px', y: '0px' };
  urlPath = [
    {
      type: 'Device',
      name: 'Device Details'
    },
    {
      type: 'Recharge',
      name: 'Recharge Point'
    },
    {
      type: 'Move',
      name: 'Move Device'
    },
    {
      type: 'modify',
      name: 'Modify Recharge Due'
    },
    {
      type: 'delete',
      name: 'Delete Device'
    }
  ];
  bsModalRef!: BsModalRef;
  spinnerLoading: boolean = false;
  rechargeData: any;
  vehicleListHeight: string = 'auto';
  swiperList: any;
  bsModalRef1!: BsModalRef
  balancePointCount: any;
  newPointCount: any;
  renewalPointCount: any;
  selectDealerCustomer: any;



  constructor(
    private dashboardService: AdminDashboardService,
    private bsmodelService: BsModalService,
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService,
    private CommonService: CommonService,
    private adminProfileService: AdminProfileService,
    private storageService : StorageService

  ) { };

  ngOnInit() {
    this.checkDealerCustomer()
    this.getDealerList();
  }

  checkDealerCustomer() {
    this.selectDealerCustomer = JSON.parse(localStorage.getItem('adminDealerCustomer') || 'null');
  }

  ngOnChanges() {
    this.swiperList = this.vehicleDatacount;
    this.updateVehicleListHeight()
  }

  getDealerList() {
    this.dashboardService.getDealerList().subscribe((res: any) => {      
      this.dealerData = res?.body?.Result?.Data;      
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer: this.dealerData[0].Id;
        this.selectDealerName = this.selectDealerCustomer && this.selectDealerCustomer?.dealerName ? this.selectDealerCustomer?.dealerName : this.dealerData[0]?.Name
        let selectedDropdownData: any = {
          dealer: this.selectedDealer,
          dealerName: this.selectDealerName,
        };        
        localStorage.setItem('adminDealerCustomer', JSON.stringify(selectedDropdownData))

        this.getCustomerData(this.selectedDealer);
        this.getBalancePoint(this.selectedDealer)
      }
    });
  }

  getCustomerData(id: any) {
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
     
      let selectedDropdownData:any = {
        dealer: this.selectedDealer,
        dealerName: this.selectDealerName,
      }
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer =  this.selectDealerCustomer && this.selectDealerCustomer?.customer ? this.selectDealerCustomer?.customer : this.customerData[0].Id;
        selectedDropdownData.customer = this.selectedCustomer;
        localStorage.setItem('adminDealerCustomer', JSON.stringify(selectedDropdownData))
        this.onSelectCustomer.emit({ customer: { selectcus: this.selectedCustomer, type: false } })
      }
      localStorage.setItem('adminDealerCustomer', JSON.stringify(selectedDropdownData))
      this.onSelectCustomer.emit({ customer: { selectcus: this.selectedCustomer, type: false } })

    });
  }

  onDealerSelect(dealerId: any) {
    this.selectDealerName = null
    this.selectedCustomer = null;
    this.selectDealerCustomer = null;
    const foundObj = this.dealerData.find((obj: any) => obj.Id === dealerId);
    this.selectDealerName = foundObj?.Name
    this.selectedDealer = dealerId
    this.getCustomerData(dealerId);
    this.getBalancePoint(this.selectedDealer)
    this.onSelectCustomer.emit({ customer: { selectcus: this.selectedCustomer, type: true } })

  }

  onCustomerSelect(customerId: any) {
    this.selectedCustomer = null;
    this.selectedCustomer = customerId;
    let selectedDropdownData:any = {
      dealer: this.selectedDealer,
      dealerName: this.selectDealerName,
    }
      selectedDropdownData.customer = this.selectedCustomer;
      localStorage.setItem('adminDealerCustomer', JSON.stringify(selectedDropdownData))
    this.getBalancePoint(this.selectedCustomer)
    this.onSelectCustomer.emit({ customer: { selectcus: this.selectedCustomer, type: true } })
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }

  openAllresellerDetails() {
    const initialState: ModalOptions = {
      initialState: {
        selectDealer: this.selectedDealer,
        dealerName: this.selectDealerName
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      AllCustomerDetailsComponent,
      Object.assign(initialState, {
        id: "confirmation",
        class: "modal-xl modal-dialog-centered",
      })
    );
  }

  onContextMenu(event: MouseEvent, item: any, i: any): void {
    this.selectedVehicleValue = item;   
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  redirectTo(type: any) {
    if (type == 'Device') {
      this.opneDevice(this.selectedVehicleValue)
    } else if (type == 'delete') {
      this.deletDevice(this.selectedVehicleValue)
    } else if (type == 'Recharge') {
      this.getRechargeDetail(this.selectedVehicleValue)
    } else if (type == 'modify') {
      this.modifiedRecharge(this.selectedVehicleValue)
    } else if (type == 'activate') {
      this.activatePoint(this.selectedVehicleValue)
    }else if (type == 'Move') {
      this.openMoveDevice(this.selectedVehicleValue)
    }
  }

  openMoveDevice(device:any) {    
    const initialState: ModalOptions = {
      initialState: {
        dealerId: this.selectedDealer,
        customerId: this.selectedCustomer,
        deviceId: device?.Device?.Id,
        deviceName: 'Move Device'

      },
    };
    this.bsModalRef = this.bsmodelService.show(
      MoveSelectDeviceOverviewComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

  opneDevice(device: any) {
    const initialState: ModalOptions = {
      initialState: {
        selectedDealer: this.selectedDealer,
        selectedCustomer: this.selectedCustomer,
        device: device?.Device?.Id,
        type: 'Admin'
      },
    };
    this.bsModalRef = this.bsmodelService.show(
      DeviceDetailsComponent,
      Object.assign(initialState, { class: "modal-lg modal-dialog-centered alert-popup" })
    );
  }

  openAdvanceSetting(device: any) {
    const initialState: ModalOptions = {
      initialState: {
        selectedDealer: this.selectedDealer,
        selectedCustomer: this.selectedCustomer,
        device: device?.Device?.Id,
        type: 'Admin'
      },
    };
    this.bsModalRef = this.bsmodelService.show(
      AdvanceSettingComponent,
      Object.assign(initialState, { class: "modal-lg modal-dialog-centered alert-popup" })
    );
  }

  deletDevice(device: any) {
    let url = this.deviceManageService.deleteDeviceManage(this.selectedDealer, this.selectedCustomer, device?.Device?.Id)
    const initialState: ModalOptions = {
      initialState: {
        title: device?.Device?.DeviceId,
        content: 'Are you sure you want to delete?',
        primaryActionLabel: 'Delete',
        secondaryActionLabel: 'Cancel',
        service: url
      },
    };
    this.bsModalRef = this.bsmodelService.show(
      DeleteConfirmationComponent,
      Object.assign(initialState, {
        id: "confirmation",
        class: "modal-md modal-dialog-centered",
      })
    );

    this.bsModalRef?.content.mapdata.subscribe(
      (value: any) => {
        if (value?.body?.ResponseMessage == 'Success') {
          this.notificationService.showSuccess(value?.body?.Result?.Data)
        } else {
          this.notificationService.showError(value?.error.Error?.Message)
        }
      }
    );
  }

  modifiedRecharge(device: any) {
    const initialState: ModalOptions = {
      initialState: {
        selectedDealer: this.selectedDealer,
        selectedCustomer: this.selectedCustomer,
        deviceId: device?.Device?.Id,
        Id: device?.PointValidity?.Id,
        deviceData: device,
        tittle: 'Device Validity',
        type: 'admin'
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      ModifiedRechargeComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

  activatePoint(device: any) {
    const initialState: ModalOptions = {
      initialState: {
        selectedDealer: this.selectedDealer,
        selectedCustomer: this.selectedCustomer,
        deviceId: device?.Device?.Id,
        vehicleNo: device?.Device?.VehicleNo,
        tittle: 'Apply Point',
         type: 'Admin'
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      ActivatePointComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

  getRechargeDetail(device: any) {
    this.spinnerLoading = true
    this.deviceManageService.getRechargeValidity(device?.Device.Id).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200) {
        this.spinnerLoading = false;
        this.rechargeData = res?.body?.Result?.Data
        const initialState: ModalOptions = {
          initialState: {
            selectedDealer: this.selectedDealer,
            selectedCustomer: this.selectedCustomer,
            deviceId: device?.Device?.DeviceId,
            Id: device?.Device?.Id,
            vehicleNo: device?.Device?.VehicleNo,
            tittle: 'Apply Point',
            rechargeData: this.rechargeData,
            type: 'admin'
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

  // formatVehicleStatusDuration(vehicle: any) {
  //   if ((vehicle?.ResultCode == 2) || (vehicle?.ResultCode == 3)) {
  //     return `${vehicle.ResultMessage[0]}`
  //   } else {
  //     if (!vehicle || !vehicle?.StatusDuration || vehicle?.StatusDuration == null) return;
  //     const parts = vehicle.StatusDuration.split(' ');
  //     if (parts[0] === 'Never') {
  //       return `${vehicle.StatusDuration}`
  //     }
  //     if (!vehicle || !vehicle.StatusDuration || !vehicle?.Eventdata) {
  //       return '';
  //     }
  //     if (parts[0] === 'Running') {
  //       return `${parts[0]}(${vehicle?.Eventdata?.Speed} Km/h)`
  //     } else {
  //       const formattedTime = this.CommonService.formatTimeValue(parts[2]);
  //       return `${parts[0]}(${formattedTime})`;
  //     }
  //   }
  // }

   formatVehicleStatusDuration(vehicle: any) {
    if ((vehicle?.ResultCode == 2)) {
      return `${vehicle.ResultMessage[0]}`
    } else {
      if (!vehicle || !vehicle?.StatusDuration || vehicle?.StatusDuration == null) return;

      if (vehicle?.ResultCode == 3 && vehicle?.PointValidity?.CurrentPointType == 0) {
        return 'Licence point missing.';
      }else if(vehicle?.ResultCode == 3 && vehicle?.PointValidity?.CurrentPointType == 1){
        return 'Point expired, please recharge the point.';
      }  else if (vehicle?.ResultCode == 4 && vehicle?.PointValidity?.CurrentPointType == 0) {
        return 'Licence point missing.';
      }else if (vehicle?.ResultCode == 4 && vehicle?.PointValidity?.CurrentPointType == 1) {
        return 'Customer validity expired';
      } 
      
      const parts = vehicle.StatusDuration.split(' ');
      if (parts[0] === 'Never') {
        return `${vehicle.StatusDuration}`
      }
      if (!vehicle || !vehicle.StatusDuration || !vehicle?.Eventdata) {
        return '';
      }
      if (parts[0] === 'Running') {
        return `${parts[0]}(${vehicle?.Eventdata?.Speed} Km/h)`
      } else {
        const formattedTime = this.CommonService.formatTimeValue(parts[2]);
        return `${parts[0]}(${formattedTime})`;
      }
    }
  }


  getVehicleColor(vehicle: any): string {
    if (vehicle?.Status === 1 && vehicle?.SubStatus === 1) {
      return 'status-0';
    } else if (vehicle?.Status === 1 && vehicle?.SubStatus === 2) {
      return 'status-1-substatus-2';
    } else if (vehicle?.Status === 1 && vehicle?.SubStatus === 3) {
      return 'status-2-substatus-3';
    } else if (vehicle?.Status === 0) {
      return 'status-0-no-substatus';
    } else {
      return 'status';
    }
  }

  updateVehicleListHeight() {
    this.vehicleListHeight = 'auto';
    let maxEntriesForAutoHeight = 9;

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    let maxHeightPercentage: any



    if (this.vehicleData) {
      const vehicleDataLength = this.vehicleData.length;

      if (vehicleDataLength > 6 && vehicleDataLength <= 11) {
        if (windowWidth >= 1440 && windowHeight >= 900) {
          maxHeightPercentage = 0.52;
          this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
        } else if (windowWidth >= 1366 && windowHeight >= 768) {
          maxHeightPercentage = 0.47;
          this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
        } else if (windowWidth >= 1024 && windowHeight >= 768) {
          maxHeightPercentage = 0.42;
          this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
        } else if (windowWidth >= 800 && windowHeight >= 600) {
          maxHeightPercentage = 0.36;
          this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
        } else {
          this.vehicleListHeight = `auto`;
          return
        }
        this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
      } else if (vehicleDataLength <= 6) {
        this.vehicleListHeight = 'auto';
      } else {
        if (windowWidth >= 1440 && windowHeight >= 900) {
          maxHeightPercentage = 0.52;
          this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
        } else if (windowWidth >= 1366 && windowHeight >= 768) {
          maxHeightPercentage = 0.47;
          this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
        } else if (windowWidth >= 1024 && windowHeight >= 768) {
          maxHeightPercentage = 0.42;
          this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
        } else if (windowWidth >= 800 && windowHeight >= 600) {
          maxHeightPercentage = 0.36;
          this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
        } else {
          this.vehicleListHeight = `auto`;
          return
        }
        this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
      }
    } else {
      this.vehicleListHeight = 'auto';
    }
  }

  onSelectVehicle(vehicle: any) {
    if (
      !vehicle || 
      !vehicle?.StatusDuration || 
      vehicle?.StatusDuration == null || 
      !vehicle?.Eventdata || (!vehicle?.Eventdata?.Latitude && !vehicle?.Eventdata?.Longitude)
    ) return;
    this.selectVehicle.emit(vehicle)
  }

  confirm(event: any) {        
    this.vehicleData = [];
    this.vehicleData = event?.data;
    this.selectVehicleConfirm.emit(event?.data)
    this.updateVehicleListHeight()
  }

  getBalancePoint(id: any) {
    this.adminProfileService.checkBalance(id).subscribe((res: any) => {
      this.balancePointCount = res?.body?.Result?.Data
      this.balancePointCount?.forEach((val: any) => {
        if (val?.PointName == 'New points') {
          this.newPointCount = val?.Count
        } else if (val?.PointName == 'Recharge Points') {
          this.renewalPointCount = val?.Count
        }
      })
    })

  }

  onShowBalnace() {
    const initialState: ModalOptions = {
      initialState: {
        selectedDealer: this.selectedDealer,
        renewalPointCount: this.renewalPointCount,
        newPointCount: this.newPointCount,
        selectDealerName: this.selectDealerName
      },
    };
    this.bsModalRef1 = this.bsmodelService.show(
      BalancePointComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

}
