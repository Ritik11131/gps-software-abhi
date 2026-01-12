

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private apiService: ApiService,
    private http: HttpClient
  ) { }
  allReportTypeDynamically(payload: any,reportType : any): Observable<any> {    
    let url = reportType === 'Distance' ? 'Distance/distanceReport' : reportType;
    return this.apiService
      .post(url, payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getAddress(lat:any, lng:any) {
    // let url = `https://gpssoftware.in/web_api/api/geocode/Geocode/miracle/miracle/${lat}/${lng}`
    // let url = `http://103.89.44.154/devicecheckapi/WeatherForecast/GetAddress?lat=${lat}&lng=${lng}`
let url = `https://gpssoftware.in/web_api/api/Geocode/Geocode/123456/aisgps/${lat}/${lng}`
    return this.http.get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  // jainath jha api
  getAddressDetail(latitude:any, longitude:any){
    let payload = {
      lat:latitude,
      lng:longitude
    }
    let params = new HttpParams();
    params = params.appendAll(payload);
    let url = 'https://gpsvts.in:20005/WeatherForecast/GetAddress'
    return this.http.get(url,{ params: params })
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getAddressInfo(lat:any, lng:any) {
    let url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat}%2C${lng}&api_key=I2bZLLfPzJg9v3AaOdhxB1cjFiHf2M9G6nAB8CUu`
    return this.http.get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getAddressInfo2(lat:any, lng:any) {
    let url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat}%2C${lng}&api_key=I2bZLLfPzJg9v3AaOdhxB1cjFiHf2M9G6nAB8CUu`
    return this.http.get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  alertReport(payload:any): Observable<any> {
    let url = API_CONSTANTS.alert
    return this.apiService
    .postData(url, payload)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  } 



  alertType(): Observable<any> {
    let url = API_CONSTANTS.alertType
    return this.apiService
      .getData(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  

  
}
