import { Component, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { EditDeviceComponent } from '../edit-device/edit-device.component';
import { DashboardService } from 'src/app/features/users/dashboard/dashboard-summary/services/dashboard.service';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';


@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.scss']
})
export class DeviceManagementComponent {
  public configuration!: Config | any;
  public columns!: any;
  vehicleData: any;
  spinnerLoading : boolean = false;
  bsModalRef!: BsModalRef
  excelData: any;
  searchKeyword: any;
  constructor(
    private dashboardService: DashboardService,
    private modalService: BsModalService,
    private router:Router
  ) {}

  ngOnInit() {
   this.columns = [
      { key: 'Status', title: 'Status' },
      { key: 'Vehicle No.', title: 'Vehicle No.' },
      { key: 'IMEI', title: 'IMEI' },
      { key: 'Model', title: 'Model' },
      { key: 'Vehicle Type', title: 'Vehicle Type' },
      { key: 'IGN', title: 'IGN' },
      { key: 'GPS', title: 'GPS' },
      { key: 'Power', title: 'Power' },
      { key: 'Battery', title: 'Battery' },
      { key: 'SIM Card', title: 'SIM Card' },
      { key: 'Speeding Value(kph)', title: 'Speeding Value(kph)' },
      { key: 'Installation Date', title: 'Installation Date' },
      { key: 'Expire Date', title: 'Expire Date' },
      { key: 'Operation', title: 'Operation' },
    
    ];
    this.getDeviceList()
  }

  getDeviceList() {
    this.spinnerLoading = true;
    this.dashboardService.vehicleList().subscribe((res:any) => {
      this.spinnerLoading = false;
      this.vehicleData = res?.body?.Result?.Data
      
    })
  }


  onCheckVehicleDevice(device: any) {
    if (device == 1) {
      return "Car";
    } else if (device == 2) {
      return "Bus";
    } else if (device == 3) {
      return "Truck";
    } else if (device == 4) {
      return "Bike";
    } else if (device == 5) {
      return "JCB";
    } else if (device == 6) {
      return "Lifter";
    } else if (device == 7) {
      return "Loader";
    } else if (device == 8) {
      return "Marker";
    } else if (device == 9) {
      return "Person";
    } else if (device == 10) {
      return "Pet";
    } else if (device == 11) {
      return "Ship";
    } else if (device == 12) {
      return "Tanker";
    } else if (device == 13) {
      return "Taxi";
    } else if (device == 14) {
      return "Tractor";
    }
    // Default return value if device code is not recognized
    return "NA";
  }

  onEditData(data:any) {    
    const initialState: ModalOptions = {
      initialState: {
        data: data
      },
    };
    this.bsModalRef = this.modalService.show(
      EditDeviceComponent,
      Object.assign(initialState, {
        id: "confirmation",
        class: "modal-md modal-dialog-centered",
      })
    );

    this.bsModalRef?.content.mapdata.subscribe((val: any) => {            
      this.getDeviceList();
    })
  }

  redirect(data:any){
    this.router.navigateByUrl('/user/dashboard/summary', { state: { vehicleData: data } })
  }

  onCheckVehicleDeviceIcon(device: any) {
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
    return 'NA';
  }

  getIconClass(status: number, iconType: string): string {
    if (status === null || status === undefined) {
      return 'icon-red'; // Default to red if there's no data
    }
  
    if (iconType === 'fa-key') {
      return status === 1 ? 'icon-green' : 'icon-red';
    }
  
    // For other icons
    return status === 1 ? 'icon-green' : 'icon-red';
  }

  getBatteryIconClass(batteryStatus: string): string {
    const status = parseInt(batteryStatus, 10); 
    if (status < 20) {
      return 'fa fa-battery-empty'; 
    } else if (status >= 20 && status < 50) {
      return 'fa fa-battery-half'; 
    } else if (status >= 50 && status < 75) {
      return 'fa fa-battery-three-quarters'; 
    } else if (status >= 75) {
      return 'fa fa-battery-full';
    }
  
    return 'fa fa-battery-empty';
  }
  
  getBatteryColor(batteryStatus: string): string {
    const status = parseInt(batteryStatus, 10); 
  
    if (status < 20) {
      return 'red'; // Less than 20%
    } else if (status >= 20 && status < 50) {
      return 'orange'; // Between 20% and 50%
    } else if (status >= 50 && status < 75) {
      return 'yellow'; // Between 50% and 75%
    } else if (status >= 75) {
      return 'green'; // Greater than 75%
    }
  
    return 'gray'; // Default color for unexpected values
  }

  exportToExcels() {
      const formattedData = this.vehicleData.map((item: any) => {
        return {
          'Vehicle No.': item?.Device?.VehicleNo || 'N/A',
          'IMEI': item?.Device?.DeviceImei || 'N/A',
          'Model': item?.Device?.DeviceTypeMeta?.Name || 'N/A',
          'Type': this.onCheckVehicleDevice(item?.Device?.VehicleType) || 'N/A',
          'IGN': item?.Peripherial?.ACC == null ? 'NA' : (item?.Peripherial?.ACC == 0 ? 'Off' : 'On'),
          'GPS': item?.Eventdata?.GpsStatus == null ? 'NA' : (item?.Eventdata?.GpsStatus == 0 ? 'Off' : 'On'),
          'Power': item?.Eventdata?.EPC == null ? 'NA' : (item?.Eventdata?.EPC == 0 ? 'Off' : 'On'),
          'Battery': item?.Battery?.status || 'N/A',
          'SIM Card': item?.Device?.SimPhoneNumber || 'N/A',
          'Speeding Value(kph)': item?.Peripherial?.OverSpeedLimit || 0,
          'Installation Date': item?.Device?.InstallationDate || 'N/A',
          'Operation': item?.PointValidity?.NextRechargeDue || 'N/A'
        };
      });
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicle List');
  
      const maxColumnWidths = Object.keys(formattedData[0]).map((key) => {
        const maxLength = Math.max(
          key.length, 
          ...formattedData.map((row: any) => (row[key] ? row[key].toString().length : 0))
        );
        return { width: Math.max(10, maxLength + 2) }; 
      });
  
      worksheet['!cols'] = maxColumnWidths; 
        const fileName = `Vehicle List.xlsx`;
      XLSX.writeFile(workbook, fileName);
   
  }
  
  
  
  
  
}
