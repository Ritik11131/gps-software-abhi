import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class CustomerManageService {

  constructor(
    private apiService: ApiService
  ) { }

  getCoustomer(dealerId:any, customerId:any): Observable<any> {
    let url = API_CONSTANTS.getCoustomer.replace('{dealerId}',dealerId).replace('{customerId}', customerId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateCustomer(id:any,payload:any) : Observable<any> {
    let url = API_CONSTANTS.updateCustomer.replace('{customerId}', id)
    return this.apiService
      .put(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateCustomerUser(id:any,payload:any) : Observable<any> {
    let url = API_CONSTANTS.updateCustomerUser.replace('{userId}', id)
    return this.apiService
      .put(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  customerPlanPeriod(): Observable<any> {
    let url = API_CONSTANTS.customerPlanPeriod
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getPlan(dealerId:any, customerId:any): Observable<any> {
    let url = API_CONSTANTS.getPlan.replace('{dealerId}',dealerId).replace('{customerId}', customerId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  addCustomerPlan(payload:any): Observable<any> {
    let url = API_CONSTANTS.addCustomerPlan
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateCustomerPlan(id:any,payload:any) : Observable<any> {
    let url = API_CONSTANTS.updateCustomerPlan.replace('{planId}', id)
    return this.apiService
      .put(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  deviceType(): Observable<any> {
    let url = API_CONSTANTS.deviceType
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  vehicleType(): Observable<any> {
    let url = API_CONSTANTS.vehicleType
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  operator(): Observable<any> {
    let url = API_CONSTANTS.operator
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  device(payload:any): Observable<any> {
    let url = API_CONSTANTS.device
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateDevice(payload :any, id:any) : Observable<any> {
    let url = API_CONSTANTS.updateDevice.replace('{id}', id)
    return this.apiService
      .put(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  shiftCustomer(payload:any): Observable<any> {
    let url = API_CONSTANTS.shiftCustomer
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  deleteCustomer(dealerId:any, cusId:any): Observable<any> {
    let url = API_CONSTANTS.getCoustomer.replace('{dealerId}', dealerId).replace('{customerId}', cusId)
    return this.apiService
      .delete(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  duplicateDevice(searchId:any): Observable<any> {
    let url = API_CONSTANTS.duplicateDevice.replace('{searchId}', searchId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  alertSetting(userId:any): Observable<any> {
    let url = API_CONSTANTS.alertSetting.replace('{userId}', userId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  alertsmapping(payload:any): Observable<any> {
    let url = API_CONSTANTS.alertsmapping
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  duplicateLoginId(payload:any): Observable<any> {
    let url = API_CONSTANTS.duplicateLoginId
    return this.apiService
      .getDataWithParam(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
