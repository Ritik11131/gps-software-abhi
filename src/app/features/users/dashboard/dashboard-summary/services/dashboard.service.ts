import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private apiService: ApiService
  ) { }

  vehicleList(): Observable<any> {
    let url = API_CONSTANTS.vehicleList
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  vehicleListDetail(): Observable<any> {
    let url = API_CONSTANTS.vehicleListdetail
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  liveVehicleTrack(id:any): Observable<any> {
    let url = API_CONSTANTS.liveData.replace('{id}', id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  alertReport(date : any): Observable<any> {
    let url = API_CONSTANTS.alertReport.replace('{time}', date)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getDistanceday(params:any): Observable<any> {
    let url = API_CONSTANTS.dayDistance
    return this.apiService
      .getDataWithParam(url,params)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

}
