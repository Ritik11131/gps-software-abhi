import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(
    private apiService: ApiService
  ) { }

  livetrackinghistory(payload: any): Observable<any> {
    let url = API_CONSTANTS.historydata
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  tripReport(payload:any): Observable<any> {
    let url = API_CONSTANTS.tripReport
    return this.apiService
    .post(url, payload)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
