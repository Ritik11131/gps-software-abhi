import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class SimOperatorService {

  constructor( private apiService: ApiService) { }

  getSimOperatorData(): Observable<any> {
    let url = API_CONSTANTS.simOperator
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getSimStatus(payload:any): Observable<any> {
    let url = API_CONSTANTS.simOperatorStatus
    return this.apiService
      .getDataWithParam(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getSimBillSummary(payload:any): Observable<any> {
    let url = API_CONSTANTS.simBillSummary
    return this.apiService
      .getDataWithParam(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
