import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class AdminProfileService {

  constructor(private apiService: ApiService) { }

  balancePointCount(): Observable<any> {    
    let url = API_CONSTANTS.balancePoint
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  
  checkBalance(id:any): Observable<any> {    
    let url = API_CONSTANTS.checkBalance.replace('{id}', id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  lastTransaction(): Observable<any> {    
    let url = API_CONSTANTS.lastSummary
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  profileDetail(): Observable<any> {    
    let url = API_CONSTANTS.profileDetail
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateAdminProfile(payload:any,id:any): Observable<any> {    
    let url = API_CONSTANTS.adminProfileUpdate.replace('{id}',id)
    return this.apiService
      .put(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  modifiedPassword(payload: any): Observable<any> {
    let url = API_CONSTANTS.modifiedPassword
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
