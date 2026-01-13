import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { RefreshpageService } from 'src/app/features/http-services/refreshpage.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'subuser-filter',
  templateUrl: './subuser-filter.component.html',
  styleUrls: ['./subuser-filter.component.scss']
})
export class SubuserFilterComponent {
  @Output() filterValue = new EventEmitter();
  @Output() addSubuser = new EventEmitter()
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer:any
  selectDealerCustomer: any;

  constructor(
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private router: Router,
    private refreshpage: RefreshpageService,
    private storageService: StorageService

  ) {}
  ngOnInit() {
    // Removed filter dropdowns - no need to load dealer/customer data
    // this.getDealerlist()
    // this.checkDealerCustomer()
  }

  // Commented out unnecessary API calls
  // checkDealerCustomer() {
  //   this.storageService.getItem('adminDealerCustomer').subscribe((res:any) => {
  //     this.selectDealerCustomer = res
  //   })
  // }

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
  // this.selectedCustomer = null
  // this.selectDealerCustomer = null;
  //   this.getCustomerData(dealerId);
  //   this.refreshpage.checkAndRedirect('/admin/subuser/customer-sub-user');  

  //   // this.router.navigateByUrl('admin/customer/customer-manage')
  // }

  // getCustomerData(id: any) {
  //   this.selectedDealerId = id;
  //   // this.spinnerLoading = true;
  //   this.dashboardService.customer(id).subscribe((res: any) => {
  //     // this.spinnerLoading = false;
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
  //   this.selectedCustomer = customerId;
  //   this.refreshpage.checkAndRedirect('/admin/subuser/customer-sub-user');      
  //   this.filterValue.emit({
  //     dealerId : this.selectedDealerId,
  //     customerId : this.selectedCustomer
  //   })
  // }

  redirectTo(path: any, subUser: any) {
    this.addSubuser.emit(path)
  }

}
