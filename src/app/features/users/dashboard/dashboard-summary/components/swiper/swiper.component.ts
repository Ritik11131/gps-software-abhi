import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss']
})
export class SwiperComponent {
  @Input() vehicleStauts: any;
  @Output() onConfirm = new EventEmitter()
  @Output() groupingByStatus = new EventEmitter()
  constructor( private storageService : StorageService){}
  sliderOptionsForStatus: OwlOptions = {
    loop: false,
    nav: true,
    navText: [`<i class="fa fa-angle-double-left" aria-hidden="true"></i>`, `<i class="fa fa-angle-double-right" aria-hidden="true"></i>`],
    autoWidth: true,
    autoHeight: true,
    dots: false,
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 4,
      },
      740: {
        items: 5,
      },
      940: { items: 5 },
    },

    margin: 15,
  };
  status: any
  runningCount: any;
  stopCount: any;
  idleCount: any;
  offlineCount: any;
  neverConnectedCount: any;
  expiredCount: any;
  expiresSoonCount: any;
  expiredSoon: any;
  ngOnInit() { 
  }

  private computeCounts() {
    this.neverConnectedCount = this.vehicleStauts?.filter((res: any) => {
      if (res?.Status != 0) return false;
      if (!res?.StatusDuration) return true;
      const parts = res.StatusDuration.split(' ');
      return parts[0] === 'Never';
    });
    this.offlineCount = this.vehicleStauts?.filter((res: any) => {
      if (res?.Status != 0) return false;
      if (!res?.StatusDuration) return false;
      const parts = res.StatusDuration.split(' ');
      return parts[0] !== 'Never';
    });
    this.runningCount = this.vehicleStauts?.filter((res: any) => res?.Status == 1 && res?.SubStatus == 1);
    this.stopCount = this.vehicleStauts?.filter((res: any) => res?.Status == 1 && res?.SubStatus == 2);
    this.idleCount = this.vehicleStauts?.filter((res: any) => res?.Status == 1 && res?.SubStatus == 3);
    this.expiredSoon = this.vehicleStauts?.filter((res: any) => res?.Status == 1 && res?.SubStatus == 4);
    this.expiredCount = this.vehicleStauts?.filter((res: any) => res?.Status == 2);
  }

  ngOnChanges() {
    this.computeCounts();

    if (!this.status) {
      this.status = [
        { src: "/assets/icons/feather-alert-octagon.svg", label: 0, class: '#696969', color: 'rgb(0 0 0)', status: 'All', data: [] },
        { src: "/assets/icons/awesome-gas-pump.svg", label: 0, class: 'green', color: 'rgb(25 173 0)', status: 'Running', data: [] },
        { src: "/assets/icons/zocial-call.svg", label: 0, class: 'red', color: '#c00e0e', status: "Stop", data: [] },
        { src: "/assets/icons/awesome-truck.svg", label: 0, class: 'orange', color: '#FFAF1D', status: 'Idle', data: [] },
        { src: "/assets/icons/awesome-box.svg", label: 0, class: 'gray', color: '#414141', status: "Offline", data: [] },
        { src: "/assets/icons/awesome-box.svg", label: 0, class: '#8B0000', color: '#8B0000', status: "No Conn.", data: [] },
        { src: "/assets/icons/awesome-box.svg", label: 0, class: 'rgb(104 100 100)', color: '#414141', status: "Exp. Soon", data: [] },
        { src: "/assets/icons/awesome-box.svg", label: 0, class: '#ADADAD', color: '#414141', status: "Expired", data: [] },
      ];
    }

    // Update counts and data without rebuilding array (prevents carousel reset)
    const dataMap: any = {
      'All': { label: this.vehicleStauts?.length, data: this.vehicleStauts },
      'Running': { label: this.runningCount?.length, data: this.runningCount },
      'Stop': { label: this.stopCount?.length, data: this.stopCount },
      'Idle': { label: this.idleCount?.length, data: this.idleCount },
      'Offline': { label: this.offlineCount?.length, data: this.offlineCount },
      'No Conn.': { label: this.neverConnectedCount?.length, data: this.neverConnectedCount },
      'Exp. Soon': { label: this.expiredSoon?.length, data: this.expiredSoon },
      'Expired': { label: this.expiredCount?.length, data: this.expiredCount },
    };

    this.status.forEach((item: any) => {
      const update = dataMap[item.status];
      if (update) {
        item.label = update.label;
        item.data = update.data;
      }
    });
  }

  filterData(data: any) {    
    this.storageService.setItem('status',data.status )
   this.storageService.groupByvehicle(true);
   this.storageService.startTracking(false);
   this.onConfirm.emit(data);
    // this.storageService.getItem("userDetail").subscribe((user: any) => {
    //   if (user.role === "1" || user.role === "2") {      
    //     this.onConfirm.emit(data);
    //   }
    // })
  }
}
