import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(
    private apiService : ApiService
  ) { }

  getDealerList(): Observable<any> {
    let url = API_CONSTANTS.getDealerList
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  customer(id:any): Observable<any> {
    let url = API_CONSTANTS.customer.replace("{id}",id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  customerVehicle(id:any): Observable<any> {
    let url = API_CONSTANTS.customerVehicle.replace("{id}",id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  liveVehicle(id:any): Observable<any> {
    let url = API_CONSTANTS.adminLiveVehicle.replace("{vehicleId}",id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  } 

  allReseller(id:any){
    let url = API_CONSTANTS.allReseller.replace("{id}",id)
    return this.apiService
    .get(url)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  allResellerCount(id:any,rollId:any){
    let url = API_CONSTANTS.allResellerCount.replace("{id}",id).replace('{rollId}', rollId)
    return this.apiService
    .get(url)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  selectReseller(id:any, resellerId:any) {
    let url = API_CONSTANTS.selectReseller.replace("{id}",id).replace('{resellerId}', resellerId)
    return this.apiService
    .get(url)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  selectResellerOverview(id:any, resellerId:any, rollId:any) {
    let url = API_CONSTANTS.selectResellerOverView.replace("{id}",id).replace('{resellerId}', resellerId).replace('{rollId}', rollId)
    return this.apiService
    .get(url)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  
  adminLivetrackinghistory(payload: any): Observable<any> {
    let url = API_CONSTANTS.historyApi
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getDistanceday(params:any): Observable<any> {
    let url = API_CONSTANTS.dayDistance
    return this.apiService
      .getDataWithParam(url,params)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  checkUserDetail(payload: any): Observable<any> {
    let url = API_CONSTANTS.checkDetail
    return this.apiService
      .postData(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  vehicleList(): Observable<any> {
    let url = API_CONSTANTS.vehicleList;
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

}
