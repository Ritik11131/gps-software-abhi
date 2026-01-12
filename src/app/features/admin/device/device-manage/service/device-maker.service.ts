import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class DeviceMakerService {

  constructor(private apiService:ApiService) { }

  addDeviceMaker(payload:any): Observable<any> {
    let url = API_CONSTANTS.addEditDeviceMaker
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  DeviceMakerList(payload:any): Observable<any> {
    let url = API_CONSTANTS.deviceMasterList
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  DeviceTypeList(payload:any): Observable<any> {
    let url = API_CONSTANTS.deviceTypeList
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  addDeviceType(payload:any): Observable<any> {
    let url = API_CONSTANTS.addEditDeviceType
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }
}
