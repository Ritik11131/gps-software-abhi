import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { OverviewService } from '../../services/overview.service';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'vehicle-model',
  templateUrl: './vehicle-model.component.html',
  styleUrls: ['./vehicle-model.component.scss']
})
export class VehicleModelComponent {
  DeviceList: any;
  totalActivateCount: any;
  expiredSoon: any;
  userDetail: any;
  isLoading:boolean = false

  constructor(
    private overViewservice: OverviewService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.getUserdetail()
    // this.createPieChart();
  }

  // ngAfterViewInit(): void {
  //   this.createPieChart();
  // }


  createPieChart() {
    const ctx = document.getElementById('deviceChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error("Canvas element not found.");
      return;
    }

    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Total Device', 'Activate', 'Expired Soon'],
        datasets: [{
          data: [this.DeviceList?.length, this.totalActivateCount, this.expiredSoon?.length],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  getUserdetail() {
    this.storageService.getItem("userDetail").subscribe((res: any) => {
      this.userDetail = res
      this.getDeviceDetail(this.userDetail)
    })
  }

  getDeviceDetail(profileDetail: any) {
    this.isLoading = true
    this.overViewservice.getDeviceCount(profileDetail?.dealerId, profileDetail?.role).subscribe((res: any) => {
      this.DeviceList = res?.body?.Result?.Data;
      this.isLoading = false
      this.totalActivateCount = this.DeviceList.filter((val: any) => val?.PointValidity?.CurrentPointType === 0).length;

      this.expiredSoon = this.DeviceList.filter((val: any) => {
        if (val?.PointValidity?.NextRechargeDue) {
          const dateToCheck: any = new Date(val?.PointValidity?.NextRechargeDue);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return dateToCheck <= sevenDaysAgo;
        } else {
          return false;
        }
        // this.createPieChart()
      });
      this.createPieChart();
    });
  }

}
