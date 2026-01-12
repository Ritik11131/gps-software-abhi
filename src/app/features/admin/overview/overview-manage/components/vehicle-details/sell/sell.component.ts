import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CustomerManageService } from 'src/app/features/admin/customer/customer-manage/serices/customer-manage.service';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';

import { SharedService } from 'src/app/features/http-services/shared.service';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent {
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer:any
  dealerId: any;
  customerId: any;
  deviceId: any;
  deviceData: any;
  sellFormValue!: FormGroup
  selectedDevice: any;
  devicemakerList: any;
  deviceMakerType: any;
  selectedMarkerId: any;
  selectDealerCustomer: any;

  constructor( 
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private customerService: CustomerManageService,
    private deviceManageService: DeviceManageService,
    private storageService: StorageService
  ){}

  ngOnInit(){
    this.setInitialValue()
    this.getDealerlist()
    this.getdevicemaker()
    this.checkDealerCustomer()
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res:any) => {
      this.selectDealerCustomer = res
    })
  }

  setInitialValue() {
    this.sellFormValue = this.fb.group({
      dealer: [null, [Validators.required]],
      customer: [null, [Validators.required]],
      deviceMaker: [null, [Validators.required]],
      deviceMarkerType: [null, [Validators.required]],
      deviceImei: ["", [Validators.required,Validators.pattern('^[0-9]{10,15}$')]],
      simNumber: ["", [Validators.required,Validators.pattern('^[0-9](\\d{9}|\\d{12})$')]],
      userDate: [new Date(), [Validators.required]],
      Address: [""],
    })
  }

  // getDeviceList() {
  //   this.customerService.deviceType().subscribe((res: any) => {
  //     this.deviceData = res?.body?.Result?.Data
  //     this.selectedDevice = this.deviceData[0].Id
  //     this.sellFormValue.controls['deviceMaker'].setValue(this.selectedDevice)
  //   })
  // }

  getdevicemaker() {
    this.deviceManageService.devicemaker().subscribe((res: any) => {
      this.devicemakerList = res?.body?.Result?.add;
      this.selectedDevice = this.devicemakerList[0].Id
      this.sellFormValue.controls['deviceMaker'].setValue(this.selectedDevice)
      this.getdevicemakertype(this.selectedDevice)
    });
  }

  getdevicemakertype(id: any) {
    this.deviceManageService.devicemakertype(id).subscribe((res: any) => {
      this.deviceMakerType = res?.body?.Result?.add;
      this.selectedDevice = this.deviceMakerType[0].Id
      this.sellFormValue.controls['deviceMarkerType'].setValue(this.selectedDevice)
    });
  }

  onSelectMarker(event: any) {
    this.selectedMarkerId = event
    this.sellFormValue.controls['deviceMarkerType'].setValue(null)
    this.getdevicemakertype(this.selectedMarkerId)
  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer: this.dealerData[0].Id;
        this.getCustomerData(this.selectedDealer);
        this.sellFormValue.controls['dealer'].setValue(this.selectedDealer)
      }
    })
  }
  onDealerSelect(dealerId: any) {
    this.selectDealerCustomer = null;
    this.sellFormValue.controls['customer'].setValue(null)
    this.getCustomerData(dealerId);
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.selectDealerCustomer && this.selectDealerCustomer?.customer ? this.selectDealerCustomer?.customer : this.customerData[0].Id;
        this.sellFormValue.controls['customer'].setValue(this.selectedCustomer)
      }
    });
  }

  onCustomerSelect(customerId:any) {
    this.selectedCustomer = customerId;    
  }

  submit(formValue:any){
    if (this.sellFormValue.invalid) {
      this.sellFormValue.markAllAsTouched();
      return;
    }
    console.log("formValue",formValue);
    
  }

  cancel(){
    this.sellFormValue.reset()
  }
}

