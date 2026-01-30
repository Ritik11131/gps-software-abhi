import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportManageService {

  constructor(private apiService: ApiService) { }
  allReportTypeDynamically(payload: any,reportType : any): Observable<any> {    
    let url = reportType
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  postFullUrl(url: string, payload: any): Observable<any> {
    return this.apiService
      .postFullUrl(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
