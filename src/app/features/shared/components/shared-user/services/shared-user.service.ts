import { Injectable } from '@angular/core';
import { API_CONSTANTS } from '../../../constant/API-CONSTANTS';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/features/http-services/api.service';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedUserService {

  constructor(private apiService:ApiService) { }

  getUserbyId(custmerId:any){
    let url = API_CONSTANTS.userSearch.replace("{custmerId}",custmerId)
    return this.apiService
    .get(url)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
