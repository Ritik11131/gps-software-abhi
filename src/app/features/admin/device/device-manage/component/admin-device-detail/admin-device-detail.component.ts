import { Component } from '@angular/core';

@Component({
  selector: 'admin-device-detail',
  templateUrl: './admin-device-detail.component.html',
  styleUrls: ['./admin-device-detail.component.scss']
})
export class AdminDeviceDetailComponent {
  deviceDetail: any
 
  columns: any;
  pagination ={
    page : 1,
    count : 0,
    tableSize : 100,
    tableSizes : [100, 500, 1000, 5000, 10000]
  }
  spinnerLoading: boolean = false;
  totalDistance: any;
  constructor() {

  }

  ngOnInit() {
    this.setInitialValue()
  }

  setInitialValue() {
    this.columns = [
      { key: 'Date Time', title: 'Date Time' },
      { key: 'Vehicle No', title: 'Vehicle No' },
      { key: 'Speed', title: 'Speed' },
      { key: 'Ignition', title: 'Ignition' },
      { key: 'Latitude', title: 'Latitude' },
      { key: 'Longitude', title: 'Longitude' },
      { key: 'Distance', title: 'Distance' },
    ]
  }

  confirm(event:any){
    this.deviceDetail = event?.Result
    this.pagination.count = event?.totalCount
    this.totalDistance = event?.totalDuration
  }

  /**
* table data change
* @param event 
*/
  onTableDataChange(event: any) {
    this.pagination.page = event;
  };

  onTableSizeChange(event: any): void {
    this.pagination.tableSize = event.target.value;
    this.pagination.page = 1;
  }

  
}
