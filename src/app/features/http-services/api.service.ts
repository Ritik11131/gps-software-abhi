import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of, ReplaySubject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

// import { environment } from "src/environments/environment";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {}

  responseType = { 
    observe: "response",
  };

  miniCartSubject = new ReplaySubject(1);
  setBaseSiteId(url: string) {
    
    // const formatedURl = 'http://103.109.7.173:20002/api/' + url
  //  const formatedURl = 'http://103.89.44.59:9903/api/' + url
   // const formatedURl = 'http://103.89.44.154:6068/api/' + url
  // const formatedURl = 'https://gpsvts.in:6068/api/' + url
  // const formatedURl = 'https://api.gpsvts.in/api/' + url
  // const formatedURl = 'https://api.gpsvts.in/api/' + url
  // const formatedURl = 'http://103.89.44.154:20002/api/' + url
  //  const formatedURl = 'http://103.109.7.173:5501/api/' + url
  // const formatedURl = 'http://103.178.248.110:8201/api/' + url
    const formatedURl = 'http://api.gpsvts.in/api/' + url
    // const formatedURl = 'http://103.109.7.173:6602/api/' + url

    return formatedURl;
  }

  setBaseurl(url: string) {
    const formatedURl = 'http://api.gpsvts.in/api/' + url

    //  const formatedURl = 'http://103.109.7.173:20003/api/' + url
    //  const formatedURl = 'https://gpsvts.in:20005/api/' + url
      return formatedURl;
    }

  get(urlData: any, options: any = {}): Observable<any> {
    let requestOptions = { ...this.responseType, ...options };
    return this.http
      .get(this.setBaseSiteId(urlData), requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getDataWithParam(path: string, payload: any): Observable<any> {
    let params = new HttpParams();
    params = params.appendAll(payload);
    return this.http.get(this.setBaseSiteId(path), { params: params }).pipe();
  }

  post(url: any, payload: any, options: any = {}): Observable<any> {
    let requestOptions = { ...options, ...this.responseType };    
    return this.http.post(this.setBaseSiteId(url), payload, requestOptions);
  } 

  postData(url: any, payload: any, options: any = {}): Observable<any> {
    let requestOptions = { ...options, ...this.responseType };    
    return this.http.post(this.setBaseurl(url), payload, requestOptions);
  } 

  getData(urlData: any, options: any = {}): Observable<any> {
    let requestOptions = { ...this.responseType, ...options };
    return this.http
      .get(this.setBaseurl(urlData), requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  // "application/json; imageBase64; application/pdf; multipart/form-data"

  // postFile(url: any, payload: any, options: any = {}): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Accept: "*/*",
  //   });
  //   return this.http.post(this.setBaseSiteId(url), payload, {
  //     headers: headers,
  //   });
  // }


  // getUsingDynamicCatalogPost(
  //   url: any,
  //   payload: any,
  //   options: any = {}
  // ): Observable<any> {
  //   let requestOptions = { ...options, ...this.responseType };
  //   return this.http.post(this.setDynamicSiteID(url), payload, requestOptions);
  // }

  put(url: any, payload: any, options: any = {}) {
    let requestOptions = { ...options, ...this.responseType };
    return this.http
      .put(this.setBaseSiteId(url), payload, requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  patch(url: any, payload: any, options: any = {}) {
    let requestOptions = { ...options, ...this.responseType };
    return this.http
      .patch(this.setBaseSiteId(url), payload, requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  delete(url: any, options: any = {}): Observable<any> {
    let requestOptions = { ...options, ...this.responseType };
    return this.http
      .delete(this.setBaseSiteId(url), requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }










  // getUserDetails(url: any) {
  //   const requestUrl = environment.baseAPIURl + url;
  //   const headers = new HttpHeaders()
  //     .set("Access-Control-Allow-Origin", "*")
  //     .set("Access-Control-Allow-Headers", "Content-Type")
  //     .set(
  //       "Authorization",
  //       "Basic " +
  //         btoa(
  //           `${environment.onDemand.clientId}:${environment.onDemand.secret}`
  //         )
  //     )
  //     .set("Content-Type", "application/json");
  //   return this.http.post(requestUrl, {}, { headers: headers });
  // }

  // getHomePageDate(url: any): Observable<any> {
  //   return this.http
  //     .get(this.setBaseSiteId(url))
  //     .pipe(catchError((error: HttpErrorResponse) => of(error)));
  // }
}
