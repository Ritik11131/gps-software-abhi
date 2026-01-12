import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { formatDate } from '@angular/common';
import { DeviceManageService } from '../../service/device-manage.service';

@Component({
  selector: 'admin-device-filter',
  templateUrl: './admin-device-filter.component.html',
  styleUrls: ['./admin-device-filter.component.scss']
})
export class AdminDeviceFilterComponent {
  @Output() filterValue = new EventEmitter();
  @Input()pagination:{page:any,tableSize:any}={page:null,tableSize:null}
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer: any;
  vehicleData: any;
  selectedVehicle: any;
  spinnerLoading: boolean = false;
  deviceDetailForm!: FormGroup
  count = 0;
  tableSize = 50;


  constructor(
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private deviceManageService:DeviceManageService,
    private fb: FormBuilder
  ) { }
  ngOnInit() {
    this.getDealerlist()
    this.setInitialForm()
    
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['pagination']) {
      const currentPagination = changes['pagination'].currentValue;
     
      if (currentPagination?.page !== null  && currentPagination?.tableSize) {
        this.submit(this.deviceDetailForm.value);
      }
    }
  }

  setInitialForm() {
    this.deviceDetailForm = this.fb.group({
      dealer: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      vehicle: [null, [Validators.required]],
      fromDate: [new Date(), [Validators.required]],
      toDate: [new Date(), [Validators.required]],
    })
  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.dealerData[0].Id;
        this.getCustomerData(this.selectedDealer);
        this.deviceDetailForm.controls['dealer'].setValue(this.selectedDealer)
      }
    })
  }
  onDealerSelect(dealerId: any) {
    this.getCustomerData(dealerId);
  }

  Confirm(event: any) {
    this.pagination.page = event.pageNumber
    this.pagination.tableSize = event.pageSize
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.customerData[0].Id;
        this.getVehicleData(this.selectedCustomer)
        this.deviceDetailForm.controls['customer'].setValue(this.selectedCustomer)
      }
    });
  }
  getVehicleData(id: any) {
    this.dashboardService.customerVehicle(id).subscribe((res: any) => {
      this.vehicleData = res?.body?.Result?.Data;
      this.selectedVehicle = this.vehicleData?.Device?.Id;
    })

  }

  onCustomerSelect(customerId: any) {
    this.selectedCustomer = customerId;
    this.getVehicleData(this.selectedCustomer)

  }

  submit(formValue: any) {
    this.spinnerLoading = true
    let payload = {
      "pageSize": this.pagination.tableSize,
      "pageNumber": this.pagination.page,
      "deviceId": Number(formValue?.vehicle),
      "imei": "",
      "fromdatetime": formatDate(formValue.fromDate, 'yyyy-MM-dd', 'en-US'),
      "todatetime": formatDate(formValue.toDate, 'yyyy-MM-dd', 'en-US')
    }

    this.deviceManageService.devicedetail(payload).subscribe((res:any)=>{            
      this.spinnerLoading = false
      if(res?.status == 200){
        let data = res?.body?.data
        this.filterValue.emit({
          Result : data,
          totalCount: res?.body?.rowcount,
          totalDuration: res?.body?.total_distance
        })
      }      
     
    })
    
  }


}
