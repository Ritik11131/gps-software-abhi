import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { API_CONSTANTS } from '../constant/API-CONSTANTS';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../http-services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SharedSearchService {

  constructor(private apiService : ApiService) { }

  devicelistById(deviceId:any): Observable<any> {
    let url = API_CONSTANTS.customerDeviceSearch.replace("{deviceId}",deviceId)
    return this.apiService
    .get(url)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
