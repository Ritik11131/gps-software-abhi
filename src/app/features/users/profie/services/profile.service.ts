import { Injectable } from '@angular/core';

import { Observable, catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private apiService: ApiService
  ) { }

  changePassword(payload: any): Observable<any> {
    let url = API_CONSTANTS.changePassword
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  dealerDetails(): Observable<any> {
    let url = API_CONSTANTS.dealerDetails
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  customerDetails(): Observable<any> {
    let url = API_CONSTANTS.customerDetails
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  
  updateProfile(payload: any, id:any): Observable<any> {
    let url = API_CONSTANTS.updateProfile.replace('{id}',id)
    return this.apiService
      .put(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

}
