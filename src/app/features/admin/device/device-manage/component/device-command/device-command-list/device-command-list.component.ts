import { Component } from '@angular/core';
import { DeviceCommandService } from '../../../service/device-command.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { Router } from '@angular/router';
import { RefreshpageService } from 'src/app/features/http-services/refreshpage.service';

@Component({
  selector: 'device-command-list',
  templateUrl: './device-command-list.component.html',
  styleUrls: ['./device-command-list.component.scss']
})
export class DeviceCommandListComponent {
  deviceCommandList: any
  columns: any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [25, 50, 100];
  spinnerLoading: boolean = false
  selectedMaker: any
  deviceMakerData: any
  selectedDeviceType: any
  deviceTypeData: any

  constructor(
    private deviceCommandService: DeviceCommandService,
    private refreshCustomerService: RefreshCustomerService,
    private router: Router,
    private refreshpage: RefreshpageService
  ) { }

  ngOnInit() {
    this.refreshpage.checkAndRedirect('/admin/device/device-command');
    this.refreshCustomerService.customerAdded$.subscribe(() => {
      this.getDeviceCommandList()
    });
    this.getDeviceCommandList()
    this.setInitialTable()
    this.getMakerDropdown()
    this.getDeviceTypeDropdown()

  }

  setInitialTable() {
    this.columns = [
      { key: 'Device Marker', title: 'Device Marker' },
      { key: 'Device', title: 'Device' },
      { key: 'Hexa Code', title: 'Hexa Code' },
      { key: 'Command', title: 'Command' },
      { key: 'Command Name', title: 'Command Name' },
    ]

  }

  redirectTo() {
    let url = 'admin/device/device-command/add-device-command'
    this.router.navigateByUrl(url)
  }

  onMakerSelect(event: any) {
    this.page = 1
    this.selectedMaker = event
    this.selectedDeviceType = null
    this.getDeviceCommandList()
    this.getDeviceTypeDropdown()
  }

  ondeviceTypeSelect(event: any) {
    this.page = 1
    this.selectedDeviceType = event
    this.getDeviceCommandList()
    
  }

  getMakerDropdown() {
    let payload = {
      "deviceMakerId": 0
    }
    this.deviceCommandService.deviceMakerDropdown(payload).subscribe((res: any) => {
      this.deviceMakerData = res?.body?.data
    })
  }

  getDeviceTypeDropdown() {
    let payload = {
      "deviceTypeId": this.selectedMaker ? this.selectedMaker : 0
    }
    this.deviceCommandService.deviceDeviceTypeDropdown(payload).subscribe((res: any) => {
      this.deviceTypeData = res?.body?.data
    })
  }


  getDeviceCommandList() {
    this.deviceCommandList = []
    this.spinnerLoading = true
    let payload = {
      "device_maket_id": this.selectedMaker ? this.selectedMaker : 0,
      "device_type_id": this.selectedDeviceType ? this.selectedDeviceType : 0
    }
    this.deviceCommandService.deviceCommandList(payload).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200) {
        this.deviceCommandList = res?.body?.data
      } else {
        this.deviceCommandList = []
      }
    })
  }

  onTableDataChange(event: any) {
    this.page = event;
  };


}
