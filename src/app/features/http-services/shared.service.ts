import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable, map } from 'rxjs';
import { UserService } from '../shared/user/services/user.service';
import { DatePipe, formatDate } from '@angular/common';
import { AdminDashboardService } from '../admin/dashboard/dashboard-manage/services/admin-dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  employeeId: any;
  mapdata: any;
  userId: any;
  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private adminDashboard: AdminDashboardService
    // private dashboardService: DashboardService,
    // private managementService: ManagementService
  ) { }

  getUserId() {
    return localStorage.getItem('uid');
    // this.storageService.getItem('employee_role_data').subscribe(res => {
    //  this.employeeId = res.employee_id

    //   return this.employeeId;
    // })
    // if (this.userEmail === undefined) {
    //   this.userEmail = localStorage.getItem("userNames");
    //   return this.userEmail;
    // } else {
    //   return this.userEmail;
    // }
  }

  // getDepartmentData(): any {
  //   let payload = {
  //     "DeptId": parseInt(localStorage.getItem('dept_id') || ''),
  //     "UserId": parseInt(localStorage.getItem('user_Id') || ''),
  //     "IncludeSelf": 1
  //   };
  //   return this.dashboardService.departmentList(payload).pipe(map(response => {
  //     return response
  //   }))
  // }

  // getVehicleZone() {
  //   let payload = {
  //     "DeptId": parseInt(localStorage.getItem('dept_id') || ''),
  //     "ZoneId": 0,
  //     "UserId": parseInt(localStorage.getItem('user_Id') || ''),
  //     "OnlyVehicle": 2
  //   };
  //   return this.dashboardService.vehicleBasedonZone(payload).pipe(map(response => {
  //     return response
  //   }))
  // }
  // getRoutelist() {
  //   let payload = {
  //     "DEPT_ID": parseInt(localStorage.getItem('dept_id') || ''),
  //     "User_ID": parseInt(localStorage.getItem('user_Id') || ''),
  //   }
  //   return this.managementService.routeList(payload).pipe(map(response => {
  //     return response
  //   }))
  // }
  // getdriverlist() {
  //   let payload = {
  //     "UserId": parseInt(localStorage.getItem('user_Id') || ''),
  //     "DeptId": parseInt(localStorage.getItem('dept_id') || ''),
  //     "RoleId": 101

  //   }
  //   return this.managementService.driverlist(payload).pipe(map(response => {
  //     return response
  //   }))
  // }
  formatedTime(value: any) {
    const fromdateFormatted = value?.toLocaleString('en-US', {
      hour12: false,
    });
    return formatDate(fromdateFormatted.replace(/,/g, "").replace(/\//g, "-"), 'yyyy-MM-dd HH:mm:ss', 'en-US')
  }
  formateddifference(formdate: any, toDatee: any) {
    const fromDate = new Date(formdate);
    const toDate = new Date(toDatee);

    // Calculate the time difference in milliseconds
    const timeDifference = toDate.getTime() - fromDate.getTime();

    // Convert time difference to days
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    return daysDifference

  }

  formatDateValue(dateString : any) {
    const pipe = new DatePipe('en-US');
    let originalDate = new Date(dateString);
    let formattedDate = pipe.transform(originalDate, 'dd/MM/yyyy');
    return formattedDate
  }

  formatedDateTimeHtml(dateString : any) {
    const pipe = new DatePipe('en-US');
    let originalDate = new Date(dateString);
    let formattedDate = pipe.transform(originalDate, 'dd/MM/yyyy HH:mm:ss');
    return formattedDate
  }

  getDealerData(): any {
    return this.adminDashboard.getDealerList().pipe(map(response => {
      return  response
    }))
  }

}
