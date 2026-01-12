import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
import { SubUserService } from 'src/app/features/admin/sub-user/sub-user-manage/services/sub-user.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { StorageService } from 'src/app/features/http-services/storage.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'inner-bulk-sale',
  templateUrl: './inner-bulk-sale.component.html',
  styleUrls: ['./inner-bulk-sale.component.scss']
})
export class InnerBulkSaleComponent {
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer: any;
  selectDevice: any;
  dealerId: any;
  customerId: any;
  deviceId: any;
  deviceData: any;
  spinnerLoading: boolean = false;
  rechargeData: any;
  bsModelRef!: BsModalRef
  selectDeviceDetails: any;
  selectDealerCustomer: any;
  constructor(
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private subUserService: SubUserService,
    private deviceManageService: DeviceManageService,
    private bsmodelService: BsModalService,
    private storageService: StorageService
  ) {}
  ngOnInit() {
    this.getDealerlist()
    this.checkDealerCustomer()
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res:any) => {
      this.selectDealerCustomer = res
    })
  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer: this.dealerData[0].Id;
        this.getCustomerData(this.selectedDealerId);
      }
    })
  }
  onDealerSelect(dealerId: any) {
    this.selectedCustomer = null;
    this.selectedDealerId = null;
    this.selectDealerCustomer = null;
    this.selectDevice = null;
    this.getCustomerData(dealerId);
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.selectDealerCustomer && this.selectDealerCustomer?.customer ? this.selectDealerCustomer?.customer : this.customerData[0].Id;

        this.getDeviceList(this.selectedCustomer)
      }
    });
  }

  getDeviceList(id: any) {
    this.subUserService.customerDevice(this.selectedDealerId, id).subscribe((res: any) => {
      if (res?.status == 200) {
        this.deviceData = res?.body?.Result?.Data;
        if (this.deviceData && this.deviceData.length > 0) {
          this.selectDevice = this.deviceData[0].Id;
          this.selectDeviceDetails = this.deviceData.find((e: any) => this.selectDevice == e.Id);
        }
      } else {
        this.deviceData = [];
      }
    })
  }

  onCustomerSelect(customerId: any) {
    this.selectedCustomer = null;
    this.selectDevice = null;
    this.selectedCustomer = customerId;
    this.getDeviceList(this.selectedCustomer)
  }

  onDeviceSelect(event: any) {
    this.selectDeviceDetails = this.deviceData.find((e: any) => event == e.Id);
  }

  selectFile(event:any): void {
    event.preventDefault();
    const fileInput = document.getElementById('excelFileInput');
    if (fileInput) {
      fileInput.click();
    } else {
      console.error('File input element not found');
    }
  }
  
  uploadExcel(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const data = fileReader.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      console.error('No file selected');
    }
  }
}
