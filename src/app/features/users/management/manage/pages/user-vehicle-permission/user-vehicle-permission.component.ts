import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subject, Subscription, switchMap, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-user-vehicle-permission',
  templateUrl: './user-vehicle-permission.component.html',
  styleUrls: ['./user-vehicle-permission.component.scss']
})
export class UserVehiclePermissionComponent {

  columns: any;
  deviceListData: any;
  recordCount: any = 10
  subscription: Subscription | any;
  spinnerLoading: boolean = false;


  constructor(private http: HttpClient) { }


  ngOnInit() {
    this.deviceList()
    this.setInitialValue()
  }

  setInitialValue() {
    this.columns = [
      { key: 'Date time', title: 'Date time' },
      { key: 'Last Updated', title: 'Last Updated' },
      { key: 'GPS', title: 'GPS' },
      { key: 'Speed', title: 'Speed' },
      { key: 'IGN', title: 'IGN' },
      { key: 'AC', title: 'AC' },
      { key: 'EPC', title: 'EPC' },
      { key: 'EPV', title: 'EPV' },
      { key: 'IPV', title: 'IPV' },
      { key: 'SOS', title: 'SOS' },
    ]
  }

  deviceList() {
    // this.spinnerLoading = true;
    let payload = {
      "RecordCount": parseInt(this.recordCount)
    }
    this.http.post('http://103.89.44.154/devicecheckapi/DeviceData/GetDeviceList', payload).subscribe((res: any) => {
      this.deviceListData = res?.data
      // this.spinnerLoading = false;
    })
  }

  cancel() {
    this.recordCount = 10
    this.deviceList()
  }

  // private unsubscribe$ = new Subject<void>();
  // deviceList() {
  //   this.spinnerLoading = true;
  //   let payload = {
  //     "RecordCount": this.recordCount ? parseInt(this.recordCount) : 10
  //   }
  //   this.unsubscribe()
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  //   this.subscription = timer(0, 10000).pipe(
  //     switchMap(() => this.http.post('http://103.89.44.154/devicecheckapi/DeviceData/GetDeviceList', payload)),
  //     takeUntil(this.unsubscribe$)
  //   ).
  //   subscribe({
  //     next: (res: any) => {
  //       this.spinnerLoading = false;
  //       this.deviceListData = res?.data

  //     },
  //     error: (error) => {
  //       console.error('Error fetching vehicle data:', error);
  //       this.spinnerLoading = false;
  //     }
  //   })


  // }
  // unsubscribe() {
  //   this.unsubscribe$.next();
  // }
}
