import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { DeviceMakerService } from '../../../service/device-maker.service';

@Component({
  selector: 'device-type-list',
  templateUrl: './device-type-list.component.html',
  styleUrls: ['./device-type-list.component.scss']
})
export class DeviceTypeListComponent {
  columns: any;
  searchKeyword: any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20, 50, 100];
  spinnerLoading: boolean = false
  deviceTypeData: any;
  urlPath = [
    {
      name: 'Edit Device Type',
      path: 'edit-device-type'
    },
   
  ];
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger | any;
  contextMenuPosition = { x: '0px', y: '0px' };
  selectedDeviceValue: any;
  deviceMakerData: any;
  selectColor: any;
  constructor(
    private router: Router,
    private deviceMakerService: DeviceMakerService,
    private refreshCustomerService: RefreshCustomerService,
  ) {

  }

  ngOnInit() {

    this.refreshCustomerService.customerAdded$.subscribe(() => {
      this.getDeviceTypeList()
    });
    this.setInitialTable()
    this.getDeviceTypeList()

  }

  setInitialTable() {
    this.columns = [
      { key: 'Device Marker', title: 'Device Marker' },
      { key: 'Device', title: 'Device' },
      { key: 'Ip Address', title: 'Ip Address' },
      { key: 'Port No', title: 'Port No' },
      { key: 'Gps Walk', title: 'Gps Walk' },
      { key: 'Ble Support', title: 'Ble Support' },
      { key: 'Ble Support', title: 'Action' },
    ]

  }

  redirectTo(path: any) {
    this.selectColor = this.selectedDeviceValue
    let url;
    if(path == 'edit-device-type'){
       url = `/admin/device/device-type/${path}/${this.selectedDeviceValue?.id}`
    }else{
      url = `/admin/device/device-type/${path}`
    }
     
    this.router.navigateByUrl(url);
  }

  onContextMenu(event: MouseEvent, item: any, i: any): void {
    this.selectedDeviceValue = item;
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onTableDataChange(event: any) {
    this.page = event;
  };

  

  getDeviceTypeList() {
    this.spinnerLoading = true
    let payload = {
      "child_id": "0"
    }

    this.deviceMakerService.DeviceTypeList(payload).subscribe((res: any) => {
      this.spinnerLoading = false
      if (res?.status == 200) {
        this.deviceTypeData = res?.body?.data
      }
    })
  }
}
