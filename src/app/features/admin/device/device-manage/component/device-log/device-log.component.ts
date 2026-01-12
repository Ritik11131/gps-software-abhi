import { Component } from '@angular/core';
import { DeviceManageService } from '../../service/device-manage.service';
import { formatDate } from '@angular/common';
import { DeviceLogMapComponent } from '../device-log-map/device-log-map.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-device-log',
  templateUrl: './device-log.component.html',
  styleUrls: ['./device-log.component.scss']
})
export class DeviceLogComponent {
  columns: any;
  imei:any
  selectedDate:any = new Date()
  spinnerLoading: boolean = false;
  deviceLogList: any;
  page = 1;
  count = 0;
  tableSize = 50;
  tableSizes = [25, 50, 100];
  currentData: any;
  currentDeviceData: any;
  heartData: any;
  heartBeatData: any;
  bsModelRef!: BsModalRef

  constructor(private deviceManageService:DeviceManageService,
    private bsmodelService: BsModalService,
  ) { }


  ngOnInit() {
    this.setInitialValue()
  }

  setInitialValue() {
    this.columns = [
      { key: 'Imei No', title: 'Imei No' },
      { key: 'Vehicle No', title: 'Vehicle No' },
      { key: 'Date time', title: 'Date time' },
      { key: 'GPS', title: 'GPS' },
      { key: 'Speed', title: 'Speed' },
      { key: 'IGN', title: 'IGN' },
      { key: 'AC', title: 'AC' },
      { key: 'EPC', title: 'EPC' },
      { key: 'EPV', title: 'EPV' },
      { key: 'IPV', title: 'IPV' },
      { key: 'SOS', title: 'SOS' },
      { key: 'Lat', title: 'Lat' },
      { key: 'Lng', title: 'Lng' },
      { key: 'Map View', title: 'Map View' }
    ]

    this.currentData = [
      { key: 'Imei No', title: 'Imei No' },
      { key: 'Vehicle No', title: 'Vehicle No' },
      { key: 'Date time', title: 'Date time' },
      { key: 'GPS', title: 'GPS' },
      { key: 'Speed', title: 'Speed' },
      { key: 'IGN', title: 'IGN' },
      { key: 'AC', title: 'AC' },
      { key: 'EPC', title: 'EPC' },
      { key: 'EPV', title: 'EPV' },
      { key: 'IPV', title: 'IPV' },
      { key: 'SOS', title: 'SOS' },
      { key: 'Lat', title: 'Lat' },
      { key: 'Lng', title: 'Lng' },
      { key: 'Map View', title: 'Map View' }
    ]

    this.heartData = [
      { key: 'Date Time', title: 'Date Time' },
      { key: 'Gps', title: 'Gps' },
      { key: 'Power', title: 'Power' },
      { key: 'Acc', title: 'Acc' },
      { key: 'Voltage', title: 'Voltage' },
    ]
  }

  isSubmitted  = false;
  submit(){
    this.isSubmitted = true;
    if( !this.imei || !this.selectedDate) {
      return
    }
    this.spinnerLoading = true
    let payload = {
        "pageSize": this.tableSize,
        "pageNumber": this.page,
        "imei": this.imei,
        "logDate": formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US')
    }

    this.deviceManageService.deviceLog(payload).subscribe((res:any)=>{
      this.spinnerLoading = false
      this.count = res?.body?.rowcount
      this.deviceLogList = res?.body?.data[0]
      this.currentDeviceData = res?.body?.dataLast
      this.heartBeatData = res?.body?.dataheart
      
    })

  }

  onTableDataChange(event: any) {
    this.page = event;
    this.submit()
  };

  cancel() {
    this.imei = ''
    this.selectedDate = new Date()
  }

  openDeviceLogMap(device: any) {
    const initialState: ModalOptions = {
      initialState: {
        latitude:device?.latitude,
        longitude: device?.longitude,
        vehicleNo: this.deviceLogList?.vehicle_no,
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      DeviceLogMapComponent,
      Object.assign(initialState, { class: "modal-xl modal-dialog-centered alert-popup" })
    );
  }

}
