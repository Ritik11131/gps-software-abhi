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
  expiredCount: any;
  expiresSoonCount: any;
  expiredSoon: any;
  ngOnInit() { 
  }

  ngOnChanges() {    
    this.offlineCount = this.vehicleStauts?.filter((res: any) => res?.Status == 0);
    this.runningCount = this.vehicleStauts?.filter((res: any) => res?.Status == 1 && res?.SubStatus == 1);
    this.stopCount = this.vehicleStauts?.filter((res: any) => res?.Status == 1 && res?.SubStatus == 2);
    this.idleCount = this.vehicleStauts?.filter((res: any) => res?.Status == 1 && res?.SubStatus == 3);
    this.expiredSoon = this.vehicleStauts?.filter((res: any) => res?.Status == 1 && res?.SubStatus == 4);    
    // this.expiredCount = this.vehicleStauts?.filter((res: any) => res?.isexpired === 1);
    this.expiredCount = this.vehicleStauts?.filter((res: any) => res?.Status == 2);
    // this.expiredSoon = this.vehicleStauts?.filter((res: any) => res?.isexpiredsoon === 1);    
    // this.expiredCount = this.vehicleStauts?.filter((res: any) =>res?.isexpired === 1);
    // // this.expiredSoon = this.vehicleStauts?.filter((res: any) => {
    // //   if (res?.PointValidity?.NextRechargeDue) {
    // //     const dateToCheck: any = new Date(res?.PointValidity?.NextRechargeDue);
    // //     const sevenDaysAgo = new Date();
    // //     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // //     return dateToCheck <= sevenDaysAgo;
    // //   } else {
    // //     return false;
    // //   }
    // // });
    // this.expiredSoon = this.vehicleStauts?.filter((res: any) => res?.isexpiredsoon === 1);



    this.status = [
      {
        src: "/assets/icons/feather-alert-octagon.svg",
        label: this.vehicleStauts?.length,
        class: '#696969',
        color: 'rgb(0 0 0)',
        status: 'All',
        data: this.vehicleStauts
      },
      {
        src: "/assets/icons/awesome-gas-pump.svg",
        label: this.runningCount?.length,
        class: 'green',
        color: 'rgb(25 173 0)',
        status: 'Running',
        data: this.runningCount
      },
      {
        src: "/assets/icons/zocial-call.svg",
        label: this.stopCount.length,
        class: 'blue',
        color: '#4861ED',
        status: "Stop",
        data: this.stopCount
      },
      {
        src: "/assets/icons/awesome-truck.svg",
        label: this.idleCount.length,
        class: 'orange',
        color: '#FFAF1D',
        status: 'Idle',
        data: this.idleCount
      },
      {
        src: "/assets/icons/awesome-box.svg",
        label: this.offlineCount.length,
        class: 'gray',
        color: '#414141',
        status: "Offline",
        data: this.offlineCount
      },
      {
        src: "/assets/icons/awesome-box.svg",
        label: this.expiredSoon.length,
        class: 'rgb(104 100 100)',
        color: '#414141',
        status: "Exp. Soon",
        data: this.expiredSoon
      },
      {
        src: "/assets/icons/awesome-box.svg",
        label: this.expiredCount.length,
        class: '#ADADAD',
        color: '#414141',
        status: "Expired",
        data: this.expiredCount
      },
    ];
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
