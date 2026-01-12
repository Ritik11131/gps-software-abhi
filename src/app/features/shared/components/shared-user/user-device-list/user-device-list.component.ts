import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { SubUserService } from 'src/app/features/admin/sub-user/sub-user-manage/services/sub-user.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'user-device-list',
  templateUrl: './user-device-list.component.html',
  styleUrls: ['./user-device-list.component.scss']
})
export class UserDeviceListComponent {
  @Input() userData: any
  @Output() closePopup = new EventEmitter();
  spinnerLoading: boolean = false
  deviceData: any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [25, 50, 100];
  columns: any;
  copy: boolean = false;
  index: any;
  showCopyIcon:any
  selectColor: any;


  constructor( private subUserService: SubUserService,
     private clipboardService: ClipboardService,
     private notificationService: NotificationService,

  ){}

  ngOnInit(){
    this.getDeviceList()
    this.setInitialValue()
  }

  getDeviceList() {
    this.spinnerLoading = true
    this.subUserService.customerDevice(this.userData?.Dealer?.Id, this.userData?.Customer?.Id).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200) {
        this.deviceData = res?.body?.Result?.Data
      } else {
        this.deviceData = []
      }
    })
  }

  setInitialValue() {
    this.columns = [
      { key: 'Vehicle No', title: 'Vehicle No' },
      { key: 'Device Id', title: 'Device Id' },
      { key: 'Mobile No', title: 'Mobile No' },
      { key: 'Device', title: 'Device' },
      { key: 'Installation', title: 'Installation' },
      { key: 'Point Recharge', title: 'Point Recharge' },
      { key: 'Recharge', title: 'Customer Recharge' },
    ]
  }

  copyContent(text:any,i:any){
    this.clipboardService.copyFromContent(text)
    this.copy = true
    this.index = i
    this.notificationService.showSuccess('Copied')
  }

   /**
  * table data change
  * @param event 
  */
   onTableDataChange(event: any) {
    this.page = event;
  };
}
