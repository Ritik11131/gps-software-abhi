import { Component, EventEmitter, Input, Output, HostListener, ElementRef, SimpleChanges, NgZone } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { formatDate } from '@angular/common';
import { FilterAlertsPipe } from 'src/app/features/shared/pipes/filterAlerts';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { Subject, Subscription, switchMap, takeUntil, tap, timer } from 'rxjs';

@Component({
  selector: 'alert-report',
  templateUrl: './alert-report.component.html',
  styleUrls: ['./alert-report.component.scss']
})
export class AlertReportComponent {
  @Output() onAlert = new EventEmitter();
  alertData: any[] = [];
  @Input() showChatBox: boolean | any;
  spinnerLoading: boolean = false;
  iconName = 'fa fa-refresh';
  public isLoading = false;
  private allDataLoaded = false;
  lastimeStamp: any;
  lastdata: any;
  counter: number = 10;
  counterInterval: any = null;
  subscription: Subscription | any;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private el: ElementRef,
    private zone: NgZone,
    public storageService: StorageService
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {    
    if (changes?.['showChatBox'] && changes?.['showChatBox'].currentValue) {
      this.getAlertReport();
    }
    if(changes?.['showChatBox'].currentValue == false){
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // @HostListener('scroll', ['$event'])
  // onScroll(event: any) {
  //   this.zone.run(() => {
  //     const element = event.target;
  //     const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 1;

  //     if (atBottom && !this.isLoading && !this.allDataLoaded) {
  //       this.loadMoreData();
  //     }
  //   });
  // }
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const target = event.target;  // This should point to the actual scrolling container
    const atBottom = target.scrollHeight - Math.ceil(target.scrollTop) <= target.clientHeight + 1;

    if (atBottom && !this.isLoading && !this.allDataLoaded) {
      this.loadMoreData(this.lastdata);
    }
  }

  getAlertReport() {
    if (this.isLoading || this.allDataLoaded) return;
    this.isLoading = true;
    this.subscription = timer(0, 10000).pipe(      
      switchMap(() => {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');
        return this.dashboardService.alertReport(formattedDate);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe((res: any) => {
      this.isLoading = false;
      this.lastdata = '';
      const newData = res?.body?.Result?.Data;
      this.lastdata = newData[newData.length - 1].Timestamp;;
      if (newData && newData.length > 0) {
        this.alertData = newData;
      } else {
        this.allDataLoaded = true;
      }
    });
  }

  loadMoreData(lasttime: any) {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.getAlertReport();
    }
  }

  refreshNotification() {
    this.iconName = 'fa fa-refresh fa-spin';
    setTimeout(() => {
      //  this.getAlertReport();
      this.iconName = 'fa fa-refresh';
    }, 500);
  }

  onGetAlert(alert: any) {
    if (alert && alert?.AlertTye) {
      if (alert.AlertTye == 1) {
        return alert.Di1 == 1 ? { message: 'Ignition On', color: 'green' } : { message: 'Ignition Off', color: 'red' };
      } else if (alert.AlertTye == 2) {
        return alert.Di2 == 1 ? { message: 'AC On', color: 'green' } : { message: 'AC Off', color: 'red' };
      } else if (alert.AlertTye == 3) {
        return alert.AlertTye == 3 ? { message: alert.Speed + 'km/h', color: 'red' } : { message: '', color: 'green' };
      } else if (alert.AlertTye == 4) {
        return alert.Epc == 1 ? { message: 'Power On', color: 'green' } : { message: 'Power Off', color: 'red' };
      } else if (alert.AlertTye == 5) {
        return alert.Tampor == 1 ? { message: 'Tampor ON', color: 'green' } : { message: 'Tampor Off', color: 'red' };
      } else if (alert.AlertTye == 7) {
        return alert.GeofenceStatus == 1 ? { message: 'Geofence On', color: 'green' } : { message: 'Geofence Off', color: 'red' };
      } else if (alert.AlertTye == 6) {
        return alert.AlertTye == 6 ? { message: 'SOS Alert', color: 'red' } : { message: '', color: 'balck' }
      } else if (alert.AlertTye == 8) {
        return alert.GeofenceStatus == 1 ? { message: 'Restore(Immobilizer) Engine On', color: 'green' } : { message: 'Restore(Immobilizer) Engine Off', color: 'green' }
      } else if (alert.AlertTye == 9) {
        return alert.Di2 == 1 ? { message: 'Parking On', color: 'black' } : { message: 'Parking Off', color: 'balck' }
      } else if (alert.AlertTye == 10) {
        return alert.AlertTye == 10 ? { message: 'Door', color: 'black' } : { message: '', color: 'balck' }
      } else if (alert.AlertTye == 11) {
        return alert.AlertTye == 11 ? { message: 'Stoppage', color: 'black' } : { message: '', color: 'balck' }
      } else if (alert.AlertTye == 12) {
        return alert.AlertTye == 12 ? { message: 'Subscription Info', color: 'black' } : { message: '', color: 'balck' }
      } else if (alert.AlertTye == 13) {
        return alert.AlertTye == 13 ? { message: 'Promotional Info', color: 'black' } : { message: '', color: 'balck' }
      } else if (alert.AlertTye == 14) {
        return alert.AlertTye == 14 ? { message: 'Battery Low', color: 'black' } : { message: '', color: 'balck' }
      } else if (alert.AlertTye == 17) {
        return alert.Di1 == 1 ? { message: 'Engine On in Parking', color: 'black' } : { message: 'Engine OFF in Parking', color: 'balck' }
      } else if (alert.AlertTye == 18) {
        return alert.AlertTye == 18 ? { message: 'Anti Theft in Parking', color: 'black' } : { message: '', color: 'balck' }
      }

    }
    return { message: '', color: 'black' };
  }
  selectedAlertIndex: number | null = null;
  onAlertLocation(alertData: any, index: number) {
    this.selectedAlertIndex = index;
    this.onAlert.emit(alertData);
  }
  selectedFilter: any = null
  alertFilterOptions = [
    { id: 1, label: 'Ignition ON/OFF', type: 'ignition' },
    { id: 2, label: 'AC', type: 'ac' },
    { id: 3, label: 'Over Speed', type: 'speed' },
    { id: 4, label: 'Power', type: 'power' },
    { id: 5, label: 'Tampor', type: 'tampor' },
    { id: 6, label: 'SOS Alert', type: 'sos' },
    { id: 7, label: 'Geofence', type: 'geofence' },
    { id: 8, label: 'Restore (Immobilizer)', type: 'restore' },
    { id: 9, label: 'Parking', type: 'parking' },
    { id: 10, label: 'Door', type: 'door' },
    { id: 11, label: 'Stoppage', type: 'stoppage' },
    { id: 12, label: 'Subscription Info', type: 'subscription' },
    { id: 13, label: 'Promotional Info', type: 'promotional' },
    { id: 14, label: 'Battery Low', type: 'battery' },
    { id: 17, label: 'Engine OFF in Parking', type: 'engine' },
    { id: 18, label: 'Anti Theft in Parking', type: 'AntiTheft' },
  ];
  applyFilter() {
    // This method can be used to perform additional actions when the filter changes.
    this.storageService.setAlertValue(false)
  }


}
