import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class DeviceCommandService {

  constructor(private apiService:ApiService) { }

  deviceCommandList(payload:any): Observable<any> {
    let url = API_CONSTANTS.deviceCommandList
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }
  deviceMakerDropdown(payload:any): Observable<any> {
    let url = API_CONSTANTS.deviceMakerDropdown
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  deviceDeviceTypeDropdown(payload:any): Observable<any> {
    let url = API_CONSTANTS.deviceTypeDropdown
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  commandTypeDropdown(): Observable<any> {
    let url = API_CONSTANTS.commandTypeDropdown
    return this.apiService
      .getData(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  addUpdateCommand(payload:any): Observable<any> {
    let url = API_CONSTANTS.addUpdateCommand
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }
}
