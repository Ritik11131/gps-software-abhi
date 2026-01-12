import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { StorageService } from 'src/app/features/http-services/storage.service';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-all-customer-detail-overview',
  templateUrl: './all-customer-detail-overview.component.html',
  styleUrls: ['./all-customer-detail-overview.component.scss']
})
export class AllCustomerDetailOverviewComponent {

  resellerDetails: any;
  selectDealer: any
  resellerData: any;
  page = 1;
  count = 0;
  tableSize = 100;
  tableSizes = [50, 100, 250, 500, 1000];
  type = 'All';
  columns: any
  resellerValue: any;
  dealerName: any
  userDetail: any;
  selectedType:any
  spinnerLoading:boolean = false;
  excelData: any;
  expiredCount: any;
  expiredSoon: any;

  constructor(
    private adminDashboardService: AdminDashboardService,
    private bsModalService: BsModalService,
    private storageService: StorageService,
    private datePipe: DatePipe

  ) { }

  ngOnInit() {
    this.getUserDetail()
    this.setInitialValue()
  }

  setInitialValue() {
    this.columns = [
      { key: '', title: 'Status' },
      { key: '', title: 'Customer' },
      { key: '', title: 'Mobile No.' },
      { key: '', title: 'Installation' },
      { key: '', title: 'Point Recharge' },
      { key: '', title: 'Customer Recharge' },
      { key: '', title: 'Vehicle No' },
      { key: '', title: 'type' },
      { key: '', title: 'DeviceId' },
      { key: '', title: 'IMEI' },
      { key: '', title: 'SIM Phone' },
      { key: '', title: 'Last Update' },
    ]
  }

  getUserDetail() {
    this.storageService.getItem("userDetail").subscribe((res:any) => {
      this.userDetail = res;
      this.selectDealer = this.userDetail?.dealerId
      this.getSelectResellerOverview(1, 'All')
      this.getResellerDataOverview()
    });
  }

  getResellerDataOverview() {
    this.adminDashboardService.allResellerCount(this.userDetail?.dealerId,this.userDetail?.role).subscribe((res: any) => {
      this.resellerData = res?.body?.Result?.Data
    })
  }

  getSelectResellerOverview(value: any, type: any) {
    this.spinnerLoading = true
    this.type = type;
    this.page = 1;
    this.adminDashboardService.selectResellerOverview(this.userDetail?.dealerId, value, this.userDetail?.role).subscribe((res: any) => {
      this.spinnerLoading = false;
      let data = res?.body?.Result?.Data;
      this.expiredCount = data?.filter((res: any) => res?.isexpired === 1);
      this.expiredSoon = data?.filter((res: any) => res?.isexpiredsoon === 1);  
      if(type == 'soon') {          
        this.resellerValue = this.expiredSoon;
      } else if (type == 'expired') {
        this.resellerValue = this.expiredCount;
      } else {
        this.resellerValue = data;
      }
    })
  }

  /**
 * table data change
 * @param event 
 */
  onTableDataChange(event: any) {
    this.page = event;
  };

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  cancel() {
    this.bsModalService.hide()
  }

  onCheckVehicleDevice(device: any) {
    if (device?.Device?.VehicleType == 1) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_car_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_car_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_car_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_car_gray.png';
      }
    } else if (device?.Device?.VehicleType == 2) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_bus_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_bus_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_bus_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_bus_gray.png';
      }
    } else if (device?.Device?.VehicleType == 3) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_truck_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_truck_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_truck_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_truck_gray.png';
      }
    } else if (device?.Device?.VehicleType == 4) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_bike_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_bike_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_bike_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_bike_gray.png';
      }
    } else if (device?.Device?.VehicleType == 5) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_jcb_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_jcb_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_jcb_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_jcb_gray.png';
      }
    } else if (device?.Device?.VehicleType == 6) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_lifter_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_lifter_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_lifter_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_lifter_gray.png';
      }
    } else if (device?.Device?.VehicleType == 7) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_loader_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_loader_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_loader_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_loader_gray.png';
      }
    } else if (device?.Device?.VehicleType == 8) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_marker_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_marker_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_marker_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_marker_gray.png';
      }
    } else if (device?.Device?.VehicleType == 9) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_person_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_person_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_person_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_person_gray.png';
      }
    } else if (device?.Device?.VehicleType == 10) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_pet_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_pet_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_pet_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_pet_gray.png';
      }
    } else if (device?.Device?.VehicleType == 11) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_ship_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_ship_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_ship_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_ship_gray.png';
      }
    } else if (device?.Device?.VehicleType == 12) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_tanker_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_tanker_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_tanker_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_tanker_gray.png';
      }
    } else if (device?.Device?.VehicleType == 13) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/geen_taxi_f.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/blue_taxi_f.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/yellow_taxi_f.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/gray_taxi_f.png';
      }
    } else if (device?.Device?.VehicleType == 14) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_tractor_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_tractor_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_tractor_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_tractor_gray.png';
      }
    }
    return "NA";
  }

  exportToExcels() {
    this.excelData = this.resellerValue.map((item: any) => {
      {
        return {
          'Customer': item?.Customer?.CustomerName,
          'Mobile No.': item?.Customer?.ContactNumber,
          'Installation': this.formatDate(item?.Device?.InstallationDate),
          'Point Recharge': this.formatDate(item?.PointValidity?.NextRechargeDue),
          'Customer Recharge': this.formatDate(item?.PointValidity?.CustomerRechargeDue),
          'Vehicle No' : item?.Device?.VehicleNo, 
          'Type': item?.Device?.DeviceTypeMeta?.Name,
          'DeviceId': item?.Device?.DeviceId,
          'IMEI' : item?.Device?.DeviceImei,
          'SIM Phone' : item?.Device?.SimPhoneNumber,
          'Last Update': this.formatDate(item?.Eventdata?.Timestamp)
        }
      }
      
    })
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excelData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Device Report');
    XLSX.writeFile(wb,  `All Device Report.xlsx`);
  }

  formatDate(date: string | null): string {
    return date ? this.datePipe.transform(date, 'dd-MM-yyyy') || '' : '';
  }


}
