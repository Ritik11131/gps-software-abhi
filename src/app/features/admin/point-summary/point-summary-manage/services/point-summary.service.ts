import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class PointSummaryService {
  constructor(
    private apiService: ApiService
  ) { }

  pointSummary(payload:any): Observable<any> {
    let url = API_CONSTANTS.pointSummaryList
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

}
