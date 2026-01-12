import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class GeofanceService {

  constructor(
    private apiService: ApiService

  ) { }

  createGeofance(payload: any): Observable<any> {
    let url = API_CONSTANTS.createGeofance
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateGeofance(payload: any, id:any): Observable<any> {
    let url = API_CONSTANTS.updateGeofance.replace('{id}', id)
    return this.apiService
      .put(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }


  geofanceList(): Observable<any> {
    let url = API_CONSTANTS.geofanceList
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  deleteGeofance(id:any,payload:any): Observable<any> {
    let url = API_CONSTANTS.deleteGeofance.replace('{id}', id)
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  
}
