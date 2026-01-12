import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { CommonService } from 'src/app/features/shared/services/common.service';
import { Subject, Subscription, filter, switchMap, takeUntil, timer } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DeviceDetailsComponent } from 'src/app/features/admin/device/device-manage/component/device/device-details/device-details.component';
import { DeleteConfirmationComponent } from 'src/app/features/shared/components/delete-confirmation/delete-confirmation.component';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { AllCustomerDetailsComponent } from '../all-customer-details/all-customer-details.component';
import { ModifiedRechargeComponent } from 'src/app/features/admin/device/device-manage/component/device/modified-recharge/modified-recharge.component';
import { RechargePointComponent } from 'src/app/features/admin/device/device-manage/component/device/recharge-point/recharge-point.component';

@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  @Output() onConfirm = new EventEmitter();
  @Output() onSelect = new EventEmitter()
  dealerData: any;
  selectedDealer: any;
  customerData: any;
  selectedCustomer: any;
  vehicleData: any;
  subscription: Subscription | any;
  spinnerLoading: boolean = false;
  private unsubscribeRouteChange$ = new Subject<void>();
  showContent: boolean = true;
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
      type: 'modify',
      name: 'Modify Recharge Due'
    },
    {
      type: 'delete',
      name: 'Delete Device'
    },
  ];
  bsModalRef!: BsModalRef;
  contextMenuPosition = { x: '0px', y: '0px' };
  vehicleListHeight: string = 'auto';


  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger | any;
  selectedVehicleValue: any;
  bsModelRef!: BsModalRef
  dealerValue: any;
  selectDealerName: any;
  rechargeData: any;
  swiperData: any;



  constructor(
    private dashboardService: AdminDashboardService,
    private CommonService: CommonService,
    private router: Router,
    private modalservice: BsModalService,
    private notificationService: NotificationService,
    private deviceManageService: DeviceManageService,
    private refreshCustomerService: RefreshCustomerService,
    private bsmodelService: BsModalService
  ) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeRouteChange$)
    ).subscribe((event: any) => {
      this.unsubscribe();
    });
  }

  ngOnInit() {
    this.getDealerList();
    this.refreshCustomerService.customerAdded$.subscribe(() => {
      this.getVehicleData(this.selectedCustomer)
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeRouteChange$.next();
    this.unsubscribeRouteChange$.complete();

    this.subscription?.unsubscribe();
  }

  getDealerList() {
    this.dashboardService.getDealerList().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.dealerData[0].Id;
        this.selectDealerName = this.dealerData[0]?.Name
        this.getCustomerData(this.selectedDealer);
      }
    });
  }

  getCustomerData(id: any) {
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.customerData[0].Id;
        this.getVehicleData(this.selectedCustomer)
      }
    });
  }

  onDealerSelect(dealerId: any) {
    this.subscription?.unsubscribe();
    this.selectDealerName = null
    this.selectedCustomer = null;
    this.vehicleData = null;
    this.onConfirm.emit(this.vehicleData);

    const foundObj = this.dealerData.find((obj: any) => obj.Id === dealerId);
    this.selectDealerName = foundObj?.Name
    this.selectedDealer = dealerId
    this.getCustomerData(dealerId);

  }

  onCustomerSelect(customerId: any) {
    this.subscription?.unsubscribe();
    this.selectedCustomer = null;
    this.vehicleData = null;
    this.onConfirm.emit(this.vehicleData);

    this.selectedCustomer = customerId;
    this.getVehicleData(customerId);
  }


  onItemSelect(event: any) {

  }

  onSelectCustomer(event: any) {
  }

  private unsubscribe$ = new Subject<void>();

  getVehicleData(id: any) {    
    this.vehicleData = [];
    this.swiperData = []
    this.spinnerLoading = true;
    this.unsubscribe();
    this.subscription?.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.dashboardService.customerVehicle(id)),
      takeUntil(this.unsubscribe$)
    ).subscribe((res: any) => {
      this.spinnerLoading = false
    if(res?.body?.ResponseMessage == "Success") {
      this.vehicleData = res?.body?.Result?.Data || [];
      this.swiperData = this.vehicleData;
    } else {
      this.vehicleData = [];
      this.swiperData = this.vehicleData
    }
    this.onConfirm.emit(this.vehicleData);
    });
  }

  unsubscribe() {
    this.unsubscribe$.next();
  }


  confirm(event: any) {
    this.vehicleData = [];
    this.vehicleData = event?.data;
  }

  onSelectVehicle(vehicle: any) {
    this.onSelect.emit(vehicle)
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

  formatVehicleStatusDuration(vehicle: any) {
    if (!vehicle || !vehicle.StatusDuration) {
      return '';
    }
    const parts = vehicle.StatusDuration.split(' ');
    const formattedTime = this.CommonService.formatTimeValue(parts[2]);
    return `${parts[0]}(${formattedTime})`;
  }

  checkDevice(device: any) {
    let newDevice = device.split(' ');
    return newDevice[0]
  }

  openDropdownIndex: number = -1;
  toggleDropdown(index: number) {
    if (this.openDropdownIndex === index) {
      this.openDropdownIndex = -1;
    } else {
      this.openDropdownIndex = index;
    }
  }

  redirectTo(type: any) {    
    if (type == 'Device') {
      this.opneDevice(this.selectedVehicleValue)
    } else if (type == 'delete') {
      this.deletDevice(this.selectedVehicleValue)
    }else if(type == 'Recharge') {
      this.getRechargeDetail(this.selectedVehicleValue)
    } else if (type == 'modify') {
      this.modifiedRecharge(this.selectedVehicleValue)
    }
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
    this.bsModalRef = this.modalservice.show(
      DeviceDetailsComponent,
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
    this.bsModalRef = this.modalservice.show(
      DeleteConfirmationComponent,
      Object.assign(initialState, {
        id: "confirmation",
        class: "modal-md modal-dialog-centered",
      })
    );

    this.bsModalRef?.content.mapdata.subscribe(
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

  onContextMenu(event: MouseEvent, item: any, i: any): void {
    this.selectedVehicleValue = item;
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
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


  // updateVehicleListHeight() {
  //   this.vehicleListHeight = 'auto';
  //   const maxEntriesForAutoHeight = 7;

  //   const windowHeight = window.innerHeight;
  //   const windowWidth = window.innerWidth;
  //   let maxHeightPercentage:any
  //   if (!this.vehicleData || this.vehicleData?.length >= maxEntriesForAutoHeight) {
      
  //     this.vehicleListHeight = 'auto';
  //   } else if (windowWidth >= 1600 && windowHeight >= 900) {     
 
  //     maxHeightPercentage = 0.65;
  //     this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
  //   } else if (windowWidth >= 1366 && windowHeight >= 768) {

  //     maxHeightPercentage = 0.62;
  //     this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
  //   } else if (windowWidth >= 1024 && windowHeight >= 768) {

  //     maxHeightPercentage = 0.58; 
  //     this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
  //   } else if (windowWidth >= 800 && windowHeight >= 600) {

  //     maxHeightPercentage = 0.55; 
  //     this.vehicleListHeight = `${windowHeight * maxHeightPercentage}px`;
  //   }
  // }
}