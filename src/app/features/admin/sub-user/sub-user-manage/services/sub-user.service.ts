import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class SubUserService {

  constructor(
    private apiService: ApiService
  ) { }

  userList(dealerId:any, cusotmerId:any): Observable<any> {
    let url = API_CONSTANTS.userList.replace('{dealerId}',dealerId).replace('{cusotmerId}', cusotmerId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  customerUser(customerId:any, userId:any): Observable<any> {
    let url = API_CONSTANTS.customerUser.replace('{cusotmerId}',customerId).replace('{userId}', userId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  customerDevice(dealerId:any, cusotmerId:any): Observable<any> {
    let url = API_CONSTANTS.customerDevice.replace('{dealerId}',dealerId).replace('{customerId}',cusotmerId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  deviceMapping(payload:any): Observable<any> {
    let url = API_CONSTANTS.deviceMapping
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  selectedDevice(id:any): Observable<any> {
    let url = API_CONSTANTS.selectedDevice.replace('{userId}', id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  deleteSubuser(dealerId:any, cusId:any, subuserId:any): Observable<any> {
    let url = API_CONSTANTS.deleteSubuser.replace('{dealerId}', dealerId).replace('{cusId}', cusId).replace('{subuserId}', subuserId)
    return this.apiService
      .delete(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }


  duplicateSubUser(searchId:any): Observable<any> {
    let url = API_CONSTANTS.duplicateSubUser.replace('{searchId}', searchId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
