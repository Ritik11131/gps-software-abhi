import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'device-fitler',
  templateUrl: './device-fitler.component.html',
  styleUrls: ['./device-fitler.component.scss']
})
export class DeviceFitlerComponent {
  @Output() filterValue = new EventEmitter();
  @Output() addDevice = new EventEmitter()
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer:any
  showOptions = false;
  selectDealerCustomer: any;

  constructor(
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private router: Router,
    private storageService: StorageService,
  ) {}
  ngOnInit() {
    // Commented out - no longer using dealer/customer filters
    // this.getDealerlist()
    // this.checkDealerCustomer()
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res:any) => {
      this.selectDealerCustomer = res
    })
  }

  // Commented out - no longer using dealer/customer filters
  // getDealerlist() {
  //   this.sharedService.getDealerData().subscribe((res: any) => {
  //     this.dealerData = res?.body?.Result?.Data;
  //     if (this.dealerData && this.dealerData.length > 0) {
  //       this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer: this.dealerData[0].Id;
  //       this.getCustomerData(this.selectedDealer);
  //     }
  //   })
  // }
  // onDealerSelect(dealerId: any) {
  //   this.selectedCustomer = null;
  //   this.selectDealerCustomer = null;
  //   this.filterValue.emit({
  //     dealerId : this.selectedDealerId,
  //     customerId : this.selectedCustomer
  //   })
  //   this.getCustomerData(dealerId);
  // }

  // getCustomerData(id: any) {
  //   this.selectedDealerId = id;
  //   this.dashboardService.customer(id).subscribe((res: any) => {
  //     this.customerData = res?.body?.Result?.Data;
  //     if (this.customerData && this.customerData.length > 0) {
  //       this.selectedCustomer = this.selectDealerCustomer && this.selectDealerCustomer?.customer ? this.selectDealerCustomer?.customer : this.customerData[0].Id;
  //       this.filterValue.emit({
  //         dealerId : this.selectedDealerId,
  //         customerId : this.selectedCustomer
  //       })
  //     }
  //   });
  // }

  // onCustomerSelect(customerId:any) {    
  //   this.selectedCustomer = null;
  //   this.selectedCustomer = customerId;    
  //   this.filterValue.emit({
  //     dealerId : this.selectedDealerId,
  //     customerId : this.selectedCustomer
  //   })
  // }

  redirectTo(path: any, subUser: any) {
   this.addDevice.emit(path)
   this.showOptions = false
  }

}
