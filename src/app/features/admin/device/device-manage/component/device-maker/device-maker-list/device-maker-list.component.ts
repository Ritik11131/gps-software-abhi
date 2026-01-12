import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceMakerService } from '../../../service/device-maker.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'device-maker-list',
  templateUrl: './device-maker-list.component.html',
  styleUrls: ['./device-maker-list.component.scss']
})
export class DeviceMakerListComponent {
  columns: any;
  searchKeyword: any;
  selectedRow: number | null = null;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20, 50, 100];
  spinnerLoading: boolean = false
  deviceMakerData: any;
  urlPath = [
    {
      name: 'Edit Device Maker',
      path: 'edit-device-maker'
    },
   
  ];
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger | any;
  contextMenuPosition = { x: '0px', y: '0px' };selectedDeviceValue: any;
  selectColor: any;
  constructor(
    private router: Router,
    private deviceMakerService: DeviceMakerService,
    private refreshCustomerService: RefreshCustomerService,
  ) {

  }

  ngOnInit() {

    this.refreshCustomerService.customerAdded$.subscribe(() => {
      this.getDeviceMarkerList()
    });
    this.setInitialTable()
    this.getDeviceMarkerList()

  }

  setInitialTable() {
    this.columns = [
      { key: 'Name', title: 'Name' },
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
    if(path == 'edit-device-maker'){
       url = `/admin/device/device-maker/${path}/${this.selectedDeviceValue?.id}`
    }else{
      url = `/admin/device/device-maker/${path}`
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

  getDeviceMarkerList() {
    this.spinnerLoading = true
    let payload = {
      "child_id": "0"
    }

    this.deviceMakerService.DeviceMakerList(payload).subscribe((res: any) => {
      this.spinnerLoading = false
      if (res?.status == 200) {
        this.deviceMakerData = res?.body?.data
      }
    })
  }
}
