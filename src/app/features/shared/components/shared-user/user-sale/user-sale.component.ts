import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerManageService } from 'src/app/features/admin/customer/customer-manage/serices/customer-manage.service';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'user-sale',
  templateUrl: './user-sale.component.html',
  styleUrls: ['./user-sale.component.scss']
})
export class UserSaleComponent {
  @Output() closePopup = new EventEmitter();
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer:any
  dealerId: any;
  customerId: any;
  deviceId: any;
  deviceData: any;
  sellForm!: FormGroup
  selectedDevice: any;
  selectDealerCustomer: any;

  constructor( 
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private customerService: CustomerManageService,
    private storageService: StorageService
  ){}

  ngOnInit(){
    this.getDealerlist()
    this.setInitialValue()
    this.getDeviceList()
    this.checkDealerCustomer()
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res:any) => {
      this.selectDealerCustomer = res
    })
  }

  setInitialValue() {
    this.sellForm = this.fb.group({
      dealer: ["", [Validators.required]],
      customer: ["", [Validators.required]],
      deviceType: ["", [Validators.required]],
      deviceImei: ["", [Validators.required]],
      simNumber: ["", [Validators.required]],
      userDate: [new Date(), [Validators.required]],
      Address: ["", [Validators.required]],
    })
  }

  getDeviceList() {
    this.customerService.deviceType().subscribe((res: any) => {
      this.deviceData = res?.body?.Result?.Data
      this.selectedDevice = this.deviceData[0].Id
      this.sellForm.controls['deviceType'].setValue(this.selectedDevice)
    })
  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer: this.dealerData[0].Id;
        this.getCustomerData(this.selectedDealer);
        this.sellForm.controls['dealer'].setValue(this.selectedDealer)
      }
    })
  }
  onDealerSelect(dealerId: any) {
    this.selectedCustomer = null
    this.selectDealerCustomer = null;
    this.getCustomerData(dealerId);
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.selectDealerCustomer && this.selectDealerCustomer?.customer ? this.selectDealerCustomer?.customer : this.customerData[0].Id;
        this.sellForm.controls['customer'].setValue(this.selectedCustomer)
      }
    });
  }

  onCustomerSelect(customerId:any) {
    this.selectedCustomer = customerId;    
  }

  submit(formValue:any){
    if (this.sellForm.invalid) {
      this.sellForm.markAllAsTouched();
      return;
    }
  }

  cancel(){
    this.closePopup.emit(false)
  }
}
