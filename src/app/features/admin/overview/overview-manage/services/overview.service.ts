import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  constructor(
    private apiService: ApiService
  ) { }


  addCustomer(payload: any): Observable<any> {
    let url = API_CONSTANTS.addCustomer
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  addCustomerUser(payload: any): Observable<any> {
    let url = API_CONSTANTS.addCustomerUser
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getDeviceCount(dealerId:any,roleid:any ): Observable<any> {
    let url = API_CONSTANTS.deviceListdetail.replace('{id}', dealerId).replace('{role}', roleid)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

}
