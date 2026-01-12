import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  constructor(
    private apiService: ApiService
  ) { }

  updateVehcleType(payload: any, id:any): Observable<any> {
    let url = API_CONSTANTS.updateVehcleType.replace('{id}', id)
    return this.apiService
      .put(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateOverSpeed(payload: any, id:any): Observable<any> {
    let url = API_CONSTANTS.updateOverSpeed.replace('{id}', id)
    return this.apiService
      .put(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateOdometer(payload: any, id:any): Observable<any> {
    let url = API_CONSTANTS.updateOdometer.replace('{id}', id)
    return this.apiService
      .put(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
