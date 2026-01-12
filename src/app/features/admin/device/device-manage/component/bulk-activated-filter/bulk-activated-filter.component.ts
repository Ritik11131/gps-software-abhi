import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { DeviceManageService } from '../../service/device-manage.service';
import { ResellerService } from 'src/app/features/admin/reseller/service/reseller.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmationDialogComponent } from 'src/app/features/shared/components/confirmation-dialog/confirmation-dialog.component';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { formatDate } from '@angular/common';
import { MoveSelectDeviceOverviewComponent } from 'src/app/features/admin/overview/overview-manage/components/vehicle-details/move-select-device-overview/move-select-device-overview.component';

@Component({
  selector: 'bulk-activated-filter',
  templateUrl: './bulk-activated-filter.component.html',
  styleUrls: ['./bulk-activated-filter.component.scss']
})
export class BulkActivatedFilterComponent {
  @Output() filterValue = new EventEmitter();
  @Input() activateData: any[] = [];
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer: any
  showOptions = false;
  selectedStatus: any
  modalRef!: BsModalRef;
  enableButton: boolean = false; 
  buttonDisabled: boolean = false
  currentDate: any;
  selectStatus = [
    { value: 'Non_Active', name: 'Non Active' },
    { value: 'bulk_modified', name: 'Bulk Modified' },
    { value: 'bulk_recharge', name: 'Bulk Recharge' },
    { value: 'bulk_move', name: 'Bulk Move' },
  ]
  modifiedEnabled: boolean = false;
  selectDealerCustomer: any;
  enableDatepicker: boolean = false;
  button: any = 'Activate Now';
  bsModalRef!: BsModalRef
  constructor(
    private dashboardService: AdminDashboardService,
    private router: Router,
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService,
    private refreshCustomerService: RefreshCustomerService,
    private resellerService: ResellerService,
    private modalService: BsModalService,
    private storageService: StorageService,
    private bsmodelService: BsModalService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activateData']) {
        this.enableButton = this.activateData?.length > 0;
    }
}
  ngOnInit() {
    const today = new Date();
    this.currentDate = new Date(today.setFullYear(today.getFullYear() + 1));
    this.getResellerList()
    this.checkDealerCustomer()
    this.selectedStatus = this.selectStatus[0].value
    if (this.selectedStatus == 'Non_Active') {
      this.buttonDisabled = true
    } else {
      this.buttonDisabled = false
    }
  }


  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res: any) => {
      this.selectDealerCustomer = res
    })
  }

  onStatusSelect(event: any) {
    this.selectedStatus = event
    if (this.selectedStatus == 'Non_Active') {
      this.button = 'Activate Now'
      this.modifiedEnabled = false
      this.buttonDisabled = true
      this.enableDatepicker = false
      this.filterValue.emit({
        dealerId: this.selectedDealerId,
        customerId: this.selectedCustomer,
        statusType: this.selectedStatus
      })
    } else if (this.selectedStatus == 'bulk_modified') {
      const today = new Date();
      this.currentDate = new Date(today.setFullYear(today.getFullYear() + 1));
      this.button = 'Bulk Modified'
      this.modifiedEnabled = true
      this.buttonDisabled = false
      this.enableDatepicker = true
      this.filterValue.emit({
        dealerId: this.selectedDealerId,
        customerId: this.selectedCustomer,
        statusType: this.selectedStatus,
      })
    }else if(this.selectedStatus == 'bulk_recharge'){
      this.button = 'Bulk Recharge'
      this.modifiedEnabled = true
      this.buttonDisabled = false
      this.enableDatepicker = false
      this.filterValue.emit({
        dealerId: this.selectedDealerId,
        customerId: this.selectedCustomer,
        statusType: this.selectedStatus,
      })
    }else if(this.selectedStatus == 'bulk_move'){
      this.button = 'Bulk Move'
      this.modifiedEnabled = true
      this.buttonDisabled = false
      this.enableDatepicker = false
      this.filterValue.emit({
        dealerId: this.selectedDealerId,
        customerId: this.selectedCustomer,
        statusType: this.selectedStatus,
      })
    }else {
      this.buttonDisabled = false
      this.modifiedEnabled = false
      this.enableDatepicker = false
    }

  }

  // getDealerlist() {
  //   this.sharedService.getDealerData().subscribe((res: any) => {
  //     this.dealerData = res?.body?.Result?.Data;
  //     if (this.dealerData && this.dealerData.length > 0) {
  //       this.selectedDealer = this.dealerData[0].Id;
  //       this.getCustomerData(this.selectedDealer);
  //     }
  //   })
  // }

  getResellerList() {
    this.resellerService.resellerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer : this.dealerData[0].Id;
        this.getCustomerData(this.selectedDealer);
      }

    });
  }

  onDealerSelect(dealerId: any) {
    this.selectedCustomer = null;
    this.selectDealerCustomer = null;
    this.filterValue.emit({
      dealerId: this.selectedDealerId,
      customerId: this.selectedCustomer,
      statusType: this.selectedStatus
    })
    this.getCustomerData(dealerId);
    // this.router.navigateByUrl('admin/customer/customer-manage')
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    // this.spinnerLoading = true;
    this.dashboardService.customer(id).subscribe((res: any) => {
      // this.spinnerLoading = false;
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.selectDealerCustomer && this.selectDealerCustomer?.customer ? this.selectDealerCustomer?.customer : this.customerData[0].Id;
        this.filterValue.emit({
          dealerId: this.selectedDealerId,
          customerId: this.selectedCustomer,
          statusType: this.selectedStatus
        })
      }
    });
  }

  onCustomerSelect(customerId: any) {
    this.selectedCustomer = null;
    this.selectedCustomer = customerId;
    this.filterValue.emit({
      dealerId: this.selectedDealerId,
      customerId: this.selectedCustomer,
      statusType: this.selectedStatus
    })
  }

  submitBulk() {
    if (this.selectedStatus == 'Non_Active') {
      this.activateNow()
    } else if (this.selectedStatus == 'bulk_modified') {
      this.bulkModified()
    }else if(this.selectedStatus == 'bulk_recharge'){
      this.bulkRecharge()
    }else if(this.selectedStatus == 'bulk_move'){
      this.bulkMove()
    }
  }

  bulkMove(){
    const initialState: ModalOptions = {
      initialState: {
        dealerId: this.selectedDealer,
        customerId: this.selectedCustomer,
        deviceName: 'Move Device',
        activateData:this.activateData,
        activateType:'Move-data'

      },
    };
    this.bsModalRef = this.bsmodelService.show(
      MoveSelectDeviceOverviewComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

  bulkRecharge(){
    this.dealerData?.forEach((val: any) => {
      if (this.selectedDealerId == val?.Id) {
        if (this.activateData?.length <= val?.RenewalPoints) {
          this.activateData?.forEach((val: any) => {
            this.submit(val)
          })
        } else {
          this.filterValue.emit({
            dealerId: this.selectedDealerId,
            customerId: this.selectedCustomer,
            statusType: this.selectedStatus,
            Type: 'notAllocate'
          })
          this.openConfirmationModal({
            title: val?.Name,
            content: `You Have In Sufficient Points ( Renewal Points :- ${val?.RenewalPoints} )`,
            primaryActionLabel: 'Ok',
            secondaryActionLabel: false,
            onPrimaryAction: () => {
              this.hideConfirmationModal();
            },
          });
        }
      }
    })
  }

  bulkModified() {
    this.dealerData?.forEach((val: any) => {
      if (this.selectedDealerId == val?.Id) {
        if (this.activateData?.length <= val?.RenewalPoints) {
          this.activateData?.forEach((val: any) => {
            this.submitBulkModified(val)
          })
        } else {
          this.filterValue.emit({
            dealerId: this.selectedDealerId,
            customerId: this.selectedCustomer,
            statusType: this.selectedStatus,
            Type: 'notAllocate'
          })
          this.openConfirmationModal({
            title: val?.Name,
            content: `You Have In Sufficient Points ( Renewal Points :- ${val?.RenewalPoints} )`,
            primaryActionLabel: 'Ok',
            secondaryActionLabel: false,
            onPrimaryAction: () => {
              this.hideConfirmationModal();
            },
          });
        }
      }
    })
  }

  activateNow() {
    this.dealerData?.forEach((val: any) => {
      if (this.selectedDealerId == val?.Id) {
        if (this.activateData?.length <= val?.NewPoints) {
          this.activateData?.forEach((val: any) => {
            this.submit(val)
          })
        } else {
          this.filterValue.emit({
            dealerId: this.selectedDealerId,
            customerId: this.selectedCustomer,
            statusType: this.selectedStatus,
            Type: 'notAllocate'
          })
          this.openConfirmationModal({
            title: val?.Name,
            content: `You Have In Sufficient Points ( New Points :- ${val?.NewPoints} )`,
            primaryActionLabel: 'Ok',
            secondaryActionLabel: false,
            onPrimaryAction: () => {
              this.hideConfirmationModal();
            },
          });
        }
      }
    })

  }

  submitBulkModified(device: any) {
    let payload = {
      "DeviceId": device?.Id,
      "DealerId": device?.ResellerId,
      "rechargedate":formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US')
    }  
    this.deviceManageService.bulModified(payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.activateData = [];
        this.router.navigateByUrl('admin/device/bulk-activated')
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }

  submit(device: any) {
    let payload = {
      "DeviceId": device?.Id,
      "DealerId": device?.ResellerId
    }
    this.deviceManageService.activatePoint(payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.router.navigateByUrl('admin/device/bulk-activated')
        this.refreshCustomerService.announceCustomerAdded();
        this.activateData = [];
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }

  openConfirmationModal(data = {}) {
    const initialState: ModalOptions = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: {
        ...data,
      },
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      Object.assign(initialState, {
        id: 'confirmationModal',
        class: 'modal-md modal-dialog-centered',
      })
    );
  }
  hideConfirmationModal() {
    this.modalService.hide('confirmationModal');
  }

}
