import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';

import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { API_CONSTANTS } from '../../constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  historycounts: any;
  constructor(  private apiService:ApiService) { }

  getMenuList(): Observable<any> {
    let url = API_CONSTANTS.menuList
  return this.apiService.get(url);
  }
  userLogin(payload: any): Observable<any> {
    const url = API_CONSTANTS.login;

    // Ensure that headers are correctly set for JSON payload
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'  // Ensure Content-Type is set to application/json
    });

    // Use post method with headers and proper error handling
    return this.apiService
      .post(url, payload, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Login failed:', error.message);
          return of(error); // Return observable of error for proper handling
        })
      );
  }
  
  dealerLogin(payload:any): Observable<any> {
    let url = API_CONSTANTS.dLogin
    
    // Ensure that headers are correctly set for JSON payload
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'  // Ensure Content-Type is set to application/json
    });

    // Use post method with headers and proper error handling
    return this.apiService
      .post(url, payload, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Login failed:', error.message);
          return of(error); // Return observable of error for proper handling
        })
      );
  }

  vendorLogin(payload:any): Observable<any> {
    let url = API_CONSTANTS.vendorLogin
    return this.apiService
    .post(url,payload)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  refreshtoken(payload:any): Observable<any> {
    let url = API_CONSTANTS.refreshToken
    return this.apiService
    .post(url,payload)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  userAccessMenu(payload:any): Observable<any> {
    let url = API_CONSTANTS.userAccess
    return this.apiService
    .post(url,payload)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  userListDetail(payload:any): Observable<any> {
    let url = API_CONSTANTS.userList
    return this.apiService
    .post(url,payload)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
 
  alertcall(payload: any): Observable<any> {
    let url = API_CONSTANTS.alertCall
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  passwordDetail(userId:any): Observable<any> {
    let url = API_CONSTANTS.forgotPasswordDetail.replace('{userId}',userId)
    return this.apiService
    .get(url)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  dealerPasswordDetail(userId:any): Observable<any> {
    let url = API_CONSTANTS.dealerForgotPassword.replace('{userId}',userId)
    return this.apiService
    .get(url)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  sentEmailRequest(payload:any): Observable<any> {
    let url = API_CONSTANTS.sendForgotEmail
    return this.apiService
      .getDataWithParam(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  sentMobileRequest(payload:any): Observable<any> {
    let url = API_CONSTANTS.sendForgotMobile
    return this.apiService
      .getDataWithParam(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  logout(payload: any): Observable<any> {
    let url = API_CONSTANTS.logout
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  historycount(count : any){
    this.historycounts = count   
  }
  gethistoryList(){
    return this.historycounts
  }


  getVehicleLastPoint(key: string): Observable<any> {
    let url = API_CONSTANTS.lastlocationData.replace('{key}',key)
    return this.apiService
    .get(url)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}