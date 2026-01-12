import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/features/http-services/api.service';
import { API_CONSTANTS } from 'src/app/features/shared/constant/API-CONSTANTS';

@Injectable({
  providedIn: 'root'
})
export class DeviceManageService {

  constructor(
    private apiService: ApiService
  ) { }



  deviceById(id:any, customerId:any, deviceId:any ): Observable<any> {
    let url = API_CONSTANTS.deviceById.replace('{id}', id).replace('{customerId}', customerId).replace('{deviceId}', deviceId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  devicemaker(): Observable<any> {
    let url = API_CONSTANTS.getdevicemaker
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  devicemakertype(id : any): Observable<any> {
    let url = API_CONSTANTS.getdevicetype.replace('{id}', id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  

  deviceMetaData(id:any, customerId:any, deviceId:any ): Observable<any> {
    let url = API_CONSTANTS.deviceMetaData.replace('{id}', id).replace('{customerId}', customerId).replace('{deviceId}', deviceId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateDeviceMeta(payload:any, deviceId:any ): Observable<any> {
    let url = API_CONSTANTS.updateDeviceMetaData.replace('{deviceId}', deviceId)
    return this.apiService
      .put(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  deleteDeviceManage(dealerId:any, cusId:any, deviceId:any): Observable<any> {
    let url = API_CONSTANTS.deleteDevice.replace('{dealerId}', dealerId).replace('{cusId}', cusId).replace('{deviceId}', deviceId)
    return this.apiService
      .delete(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  moveDevice(payload:any): Observable<any> {
    let url = API_CONSTANTS.moveDevice
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  getRechargeValidity(deviceId:any ): Observable<any> {
    let url = API_CONSTANTS.rechargePointValidity.replace('{deviceId}', deviceId)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  updateRecharge(payload:any, deviceId:any ): Observable<any> {
    let url = API_CONSTANTS.updateRecharge.replace('{deviceId}', deviceId)
    return this.apiService
      .put(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  activatePoint(payload:any): Observable<any> {
    let url = API_CONSTANTS.activatePoint
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
    }

    bulModified(payload:any): Observable<any> {
      let url = API_CONSTANTS.bulkModified
      return this.apiService
        .post(url,payload)
        .pipe(catchError((error: HttpErrorResponse) => of(error))); 
      }

  deviceTimeValidity(minute:any, id:any): Observable<any> {
    let url = API_CONSTANTS.deviceTimeValidity.replace('{min}', minute).replace('{deviceId}', id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
  getResselerById(id:any ): Observable<any> {
    let url = API_CONSTANTS.resselerById.replace('{id}', id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  createFitment(payload:any){
    let url = API_CONSTANTS.createFitment
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  deleteDeviceFitement(deviceId:any): Observable<any> {
    let url = API_CONSTANTS.deleteDeviceFitement.replace('{deviceId}', deviceId)
    return this.apiService
      .delete(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  fitmentPageImage(payload:any){
    let url = API_CONSTANTS.fitnmentImage
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  getFitmentDetail(id:any): Observable<any> {
    let url = API_CONSTANTS.showFitment.replace('{id}', id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  devicetype(): Observable<any> {
    let url = API_CONSTANTS.devicetype
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  devicetypeById(id : any): Observable<any> {
    let url = API_CONSTANTS.getdevicetypeById.replace('{id}', id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  bulkUploadFile(custmId:any,payload:any){
    let url = API_CONSTANTS.bulkUploadDevice.replace('{custmId}', custmId)
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  getOdometer(id : any): Observable<any> {
    let url = API_CONSTANTS.getOdometerDetail.replace('{id}', id)
    return this.apiService
      .get(url)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  modifiedOdometer(payload:any){
    let url = API_CONSTANTS.addOdometer
    return this.apiService
      .post(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  deviceLog(payload:any){
    let url = API_CONSTANTS.deviceLogData
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  deviceActivated(dealerId:any, customerId:any, payload:any): Observable<any> {
    let url = API_CONSTANTS.bulkDeviceActivated.replace('{dealerId}', dealerId).replace('{customerId}', customerId)
    return this.apiService
      .getDataWithParam(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }

  devicedetail(payload:any){
    let url = API_CONSTANTS.deviceDetail
    return this.apiService
      .postData(url,payload)
      .pipe(catchError((error: HttpErrorResponse) => of(error))); 
  }

  selectDeviceSummary(id:any, statusId:any) {
    let url = API_CONSTANTS.selectDeviceSummary.replace("{id}",id).replace('{statusId}', statusId)
    return this.apiService
    .get(url)
    .pipe(catchError((error: HttpErrorResponse) => of(error)));
  }
}
