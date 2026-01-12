import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { DeviceManageService } from '../../service/device-manage.service';
import { StorageService } from 'src/app/features/http-services/storage.service';
@Component({
  selector: 'app-device-bulk-upload',
  templateUrl: './device-bulk-upload.component.html',
  styleUrls: ['./device-bulk-upload.component.scss']
})
export class DeviceBulkUploadComponent {
  spinnerLoading: boolean = false
  dealerData: any;
  selectedDealer: any;
  selectedCustomer: any;
  selectedDealerId: any;
  customerData: any;
  selectedFile: any;
  columns: any;
  bulkDeviceData: any;
  page = 1;
  count = 0;
  tableSize = 10;
  selectedFileName: any = '';
  selectDealerCustomer: any;

  constructor(
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private router: Router,
    private deviceManageService: DeviceManageService,
    private storageService: StorageService
  ) { }
  ngOnInit() {
    this.getDealerlist()
    this.setInitialValue()
    this.checkDealerCustomer()
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res:any) => {
      this.selectDealerCustomer = res
    })
  }

  setInitialValue() {
    this.columns = [
      { key: 'Device Maker', title: 'Device Maker' },
      { key: 'Device Type', title: 'Device Type' },
      { key: 'Vehicle No', title: 'Vehicle No' },
      { key: 'Device Id', title: 'Device Id/IMEI' },
      { key: 'Sim Operator', title: 'Sim Operator' },
      { key: 'Sim Number', title: 'Sim Number' },
      { key: 'Installation date', title: 'Installation date' },
      { key: 'Vehicle Type', title: 'Vehicle Type' },
      { key: 'Result', title: 'Result' },
    ]
  }

  downloadExcel() {
    const filePath = 'assets/images/sample.xlsx';
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'Download Excel Sample.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  selectFile(event: any): void {
    event.preventDefault();
    const fileInput = document.getElementById('excelFileInput');
    if (fileInput) {
      fileInput.click();
    } else {
      console.error('File input element not found');
    }
  }

  uploadExcel(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.selectedFileName = fileInput.files[0].name
    } else {
      console.error('No file selected');
    }
  }
  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer: this.dealerData[0].Id;
        this.getCustomerData(this.selectedDealer);
      }
    })
  }
  onDealerSelect(dealerId: any) {
    this.selectedCustomer = null;
    this.selectDealerCustomer = null;
    this.getCustomerData(dealerId);
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    // this.spinnerLoading = true;
    this.dashboardService.customer(id).subscribe((res: any) => {
      // this.spinnerLoading = false;
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer = this.selectDealerCustomer && this.selectDealerCustomer?.customer ? this.selectDealerCustomer?.customer : this.customerData[0].Id;
      }
    });
  }

  onCustomerSelect(customerId: any) {
    this.selectedCustomer = null;
    this.selectedCustomer = customerId;
  }

  getBulkDeviceList() {
    this.spinnerLoading = true
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.deviceManageService.bulkUploadFile(this.selectedCustomer, formData).subscribe((res: any) => {
        this.spinnerLoading = false;
        if (res?.status == 200) {
          this.bulkDeviceData = res?.body?.data
        } else {
          this.bulkDeviceData = []
        }
      })
    }
  }

  refreshPage() {
    this.selectedFile = null
    this.bulkDeviceData = []
  }

  /**
  * table data change
  * @param event 
  */
  onTableDataChange(event: any) {
    this.page = event;
  };

}
