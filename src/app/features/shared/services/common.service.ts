import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../users/mis/mis-manage/services/report.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private reportService: ReportService, private http: HttpClient,
  ) { }

  formatTimeValue(time: any) {
    if (typeof time === 'undefined' || time === null || time === '') {
      return "00hr, 00min, 00sec";
    }
    
    // Handle new API format: "5 min, 15 sec" or "2 hr, 30 min, 15 sec"
    if (typeof time === 'string' && (time.includes('min') || time.includes('sec') || time.includes('hr'))) {
      // Already formatted, return as is
      return time;
    }
    
    // Handle old format: "days.hours:minutes:seconds"
    if (typeof time === 'string' && time.includes('.') && time.includes(':')) {
      try {
        const [days, timming] = time.split(".");
        if (!timming) {
          return "00hr, 00min, 00sec";
        }
        const newTime = timming.split(':');
        if (!newTime || newTime.length < 3) {
          return "00hr, 00min, 00sec";
        }
        let formattedTime = '';
      
        if (parseInt(days) !== 0 && !isNaN(parseInt(days))) {
          formattedTime += `${days}days, `;
        }
      
        if (parseInt(newTime[0]) !== 0 && !isNaN(parseInt(newTime[0]))) {
          formattedTime += `${newTime[0]}hr, `;
        }
      
        if (parseInt(newTime[1]) !== 0 && !isNaN(parseInt(newTime[1]))) {
          formattedTime += `${newTime[1]}min, `;
        }
      
        if (newTime[2] !== undefined) {
          formattedTime += `${newTime[2]}sec`;
        } else {
          formattedTime += '00sec';
        }
      
        return formattedTime || "00hr, 00min, 00sec";
      } catch (error) {
        return "00hr, 00min, 00sec";
      }
    }
    
    // Fallback for any other format
    return "00hr, 00min, 00sec";
  }
  

 

  // getAddressValue(address: any): Observable<any> {
  //   if (!address?.Lat || !address?.Lng) {
  //     return of(null); // Handle case where Lat or Lng might be undefined.
  //   }
  //   return this.reportService.getAddress(address.Lat, address.Lng).pipe(
  //     map((res: any) => {
  //        const loc =      res?.Result?.add
  //       this.pushLocationData(address.Lat, address.Lng, loc);
  //       return loc
  //     }),
      
  //   );
  // }

  getAddressValue(address: any): Observable<any> {
    if (!address?.Lat || !address?.Lng) {
      return of(null); 
    }
    return this.reportService.getAddressInfo2(address.Lat, address.Lng).pipe(
      map((res: any) => {
         const loc = res?.results[0]?.formatted_address
        //  this.pushLocationData(address.Lat, address.Lng, loc);
        return loc
      }),
      
    );
  }

  getAddressInfoDetail(address: any): Observable<any> {
    if (!address?.Lat || !address?.Lng) {
      return of(null);
    }
    return this.reportService.getAddressInfo(address.Lat, address.Lng).pipe(
      map((res: any) => {
         const loc = res?.results[0]?.formatted_address
        // this.pushLocationData(address.Lat, address.Lng, loc);
        return loc
      }),
      
    );
  }

  // private pushDataUrl = 'https://gpsvts.in:20005/api/PushData/PushData';

  // pushLocationData(lat: number, lon: number, loc: string) {  
  //   const body = { lat, lon, loc };
  //   this.http.post(this.pushDataUrl, body).pipe(
  //     catchError(error => {
  //       console.error('Error pushing data:', error);
  //       return of(null); 
  //     })
  //   ).subscribe({
  //     next: (response) => {
      
  //     },
  //     error: (error) => {
       
  //     }
  //   });
  // }
  
}
