import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONSTANTS } from '../../constant/API-CONSTANTS';
import { ApiService } from 'src/app/features/http-services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private apiService: ApiService,) { }

  // getcompanylist(payload : any): Observable<any> {
  //   const url = API_CONSTANTS.getcompany
  //   return this.apiService.getDataWithParam(url, payload);
  // }
  getnotification(): Observable<any> {
    const url = API_CONSTANTS.getnotification
    return this.apiService.get(url);
  }
  getmodulelist(): Observable<any> {
    const url = API_CONSTANTS.getmodule
    return this.apiService.get(url);
  }
  deleteCompany(payload : any): Observable<any> {
    const url = API_CONSTANTS.deleteComp + `${payload}`
    return this.apiService.delete(url, payload);
  }
}
