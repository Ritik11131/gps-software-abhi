import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Subject, take, tap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
// import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

import { UserService } from '../shared/user/services/user.service';
import { SharedModule } from '../shared/shared.module';
import { SharedService } from './shared.service';
import { NotificationService } from './notification.service';
import { JwtService } from './jwt.service';
import { ActivityService } from '../shared/user/services/activity.service';
import { isPlatformBrowser } from '@angular/common';


const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  secondsToRefreshBeforeExpiring = 10;
  // tokenSubject: BehaviorSubject<string>;
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    // this.indexedDB.clear();
    // window.location.href = environment.hostURL;
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private indexedDB: StorageService,
    private userService: UserService,
    private storageService: StorageService,
    private NotificationService: NotificationService,
    private jwtService : JwtService,
    private activityService : ActivityService ,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.hasToken()) {
      this.setRefreshTimer(
        this.getExpirationSeconds() - this.secondsToRefreshBeforeExpiring
      );
    }
  }
  isLoginClick : boolean = false
  tokenGenerated = new Subject();
  // generateToken(data: any) {
  //   this.isLoginClick = true;
  //   let payload: any;
  //   let service: any;
  
  //   if (data?.filterBy === "Customer") {
  //     payload = {
  //       "userName": data.username,
  //       "password": data.password,
  //       "fcmToken": "token",
  //       "phoneModel": "model",
  //       "PhoneType": 3,
  //       "os": "os",
  //       "appVersion": "1.0",
  //       "status": 1
  //     };
  //     service = this.userService.userLogin(payload);
  //   } else if (data?.filterBy === "Dealer/Reseller") {
  //     payload = {
  //       "userName": data.username,
  //       "password": data.password,
  //       "phoneType": 3,
  //       "selectedUserType": "3"
  //     };
  //     service = this.userService.dealerLogin(payload);
  //   }
  
  //   // Store the payload for future use in refreshToken
  //   sessionStorage.setItem('loginPayload', JSON.stringify(payload));
  
  //   service.subscribe((res: any) => {      
  //     const userDetail = res.body;
  //     this.isLoginClick = false;
  
  //     if (userDetail?.ResponseMessage === "Success") {
  //       const token = res?.body?.Result.Data;
  //       this.storageService.setItem("token", token);
  //       sessionStorage.setItem("token", token);
  //       sessionStorage.setItem("refresh_token", token);
  //       this.setExpiration(5000);
  //       this.tokenGenerated.next(true);
  //       this.activityService.continueSession();
  //       localStorage.setItem('token', token);
  //       localStorage.setItem('userName', data.username);
  
  //       if (data?.filterBy === 'Customer') {          
  //         localStorage.setItem('userType', 'customer');
  //         const decodedToken = this.jwtService.decodeToken(token);
  //         this.storageService.setItem('userDetail', decodedToken);
  //         this.NotificationService.showSuccess('Login Successfully');
  //         this.router.navigateByUrl('user/dashboard/summary');
  //       } else {
  //         localStorage.setItem('userType', 'admin');
  //         const decodedToken = this.jwtService.decodeToken(token);
  //         this.storageService.setItem('userDetail', decodedToken);
  //         this.jwtService.removeToken();
  
  //         const tabs = [{
  //           path: "admin/overview/admin-overview",
  //           name: "OverView",
  //           active: true
  //         }];
  //         this.storageService.setItems('tabs', JSON.stringify(tabs));
  //         this.NotificationService.showSuccess('Login Successfully');
  //         this.router.navigateByUrl('admin/overview/admin-overview');
  //       }
  
  //       return userDetail.jwtToken;
  //     } if (res?.error?.StatusCode === 404) {
  //       this.NotificationService.showError(res?.error?.Error?.Data);
  //     } else if (res?.error?.StatusCode === 500) {
  //       this.NotificationService.showError('An unexpected error occurred on the server. Please try again later.');
  //     } else if (navigator.onLine === false) {
  //       this.NotificationService.showError('You are offline. Please check your internet connection.');
  //     } else {
  //       this.NotificationService.showError('An unknown error occurred. Please try again later.');
  //     }
      
  //   });
  // }

  generateToken(data: any) {
    this.isLoginClick = true;
    let payload: any;
    let service: any;
  
    if (data?.filterBy === "Customer") {
      payload = {
        "userName": data.username,
        "password": data.password,
        "fcmToken": "token",
        "phoneModel": "model",
        "PhoneType": 3,
        "os": "os",
        "appVersion": "1.0",
        "status": 1
      };
      service = this.userService.userLogin(payload);
    } else if (data?.filterBy === "Dealer/Reseller") {
      payload = {
        "userName": data.username,
        "password": data.password,
        "phoneType": 3,
        "selectedUserType": "3"
      };
      service = this.userService.dealerLogin(payload);
    }
  
    // Store the payload for future use in refreshToken
    sessionStorage.setItem('loginPayload', JSON.stringify(payload));
  
    return service.pipe(
      tap((res: any) => {
        const userDetail = res.body;
        this.isLoginClick = false;
  
        if (userDetail?.ResponseMessage === "Success") {
          const token = res?.body?.Result.Data;
          this.storageService.setItem("token", token);
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("refresh_token", token);
          this.setExpiration(5000);
          this.tokenGenerated.next(true);
          this.activityService.continueSession();
          localStorage.setItem('token', token);
          localStorage.setItem('userName', data.username);
  
          if (data?.filterBy === 'Customer') {
            localStorage.setItem('userType', 'customer');
            const decodedToken = this.jwtService.decodeToken(token);
            this.storageService.setItem('userDetail', decodedToken);
            this.NotificationService.showSuccess('Login Successfully');
            this.router.navigateByUrl('user/dashboard/summary');
          } else {
            localStorage.setItem('userType', 'admin');
            const decodedToken = this.jwtService.decodeToken(token);
            this.storageService.setItem('userDetail', decodedToken);
            this.jwtService.removeToken();
  
            const tabs = [{
              path: "admin/overview/admin-overview",
              name: "OverView",
              active: true
            }];
            this.storageService.setItems('tabs', JSON.stringify(tabs));
            this.NotificationService.showSuccess('Login Successfully');
            this.router.navigateByUrl('admin/overview/admin-overview');
          }
        }
      }),
      catchError((error: any) => {
        this.isLoginClick = false;
        if (error?.error?.StatusCode === 404) {
          this.NotificationService.showError(error?.error?.Error?.Data);
        } else if (error?.error?.StatusCode === 500) {
          this.NotificationService.showError('An unexpected error occurred on the server. Please try again later.');
        } else if (!navigator.onLine) {
          this.NotificationService.showError('You are offline. Please check your internet connection.');
        } else {
          this.NotificationService.showError('An unknown error occurred. Please try again later.');
        }
        return throwError(error);
      })
    );
  }

  setExpiration(seconds: number) {
    seconds = 5000;
    let currentTime = new Date().getTime() / 1000;
    let expirationTime = currentTime + seconds;
    
    // Set the expiration time in sessionStorage
    sessionStorage.setItem("tokenExpires", expirationTime.toString());
    
    // Log the actual expiration time in a readable format
    let expirationDate = new Date(expirationTime * 1000);    
    // Set the refresh timer
    this.setRefreshTimer(seconds - this.secondsToRefreshBeforeExpiring);
  }
  setRefreshTimer(seconds: number) {
    if (seconds < 0) seconds = 0;
    setTimeout(() => {
      this.refeshToken();
    }, seconds * 1000);
  }
  refeshToken() {
    if (this.activityService.userIsActive()) {
      // Retrieve the stored payload
      const payload = sessionStorage.getItem('loginPayload');
  
      // Use the dealerLogin service with the stored payload
      this.userService.userLogin(payload).subscribe((res: any) => {
        const token = res?.body?.Result?.Data;
  
        if (token) {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("refresh_token", token);
          this.setExpiration(50000);
          this.NotificationService.showSuccess('Token refreshed successfully');
        } else {
          this.NotificationService.showError('Failed to refresh token');
        }
      }, (error: any) => {
        this.NotificationService.showError('Error refreshing token: ' + error.message);
      });
    } else {
      this.activityService.userResumedSession.pipe(take(1)).subscribe(() => {
        this.refeshToken();
      });
    }
  }
  
  getloginstatus(){
    return this.isLoginClick
  }
  getToken() {
    return localStorage.getItem('token');
  }

  isBrowser: boolean | any;
  hasToken() {
    if (!this.isBrowser) {
      return false;
    }
    return sessionStorage.getItem("token") !== null && !this.tokenIsExpired();
  }
  tokenIsExpired(): boolean {
    let expirationTime = sessionStorage.getItem("tokenExpires");
    if (expirationTime === null) return true;
    let currentTime = new Date().getTime() / 1000;
    return Number(expirationTime) - currentTime < 0;
  }
  getExpirationSeconds() {
    let expirationTime = sessionStorage.getItem("tokenExpires");
    let currentTime = new Date().getTime() / 1000;
    return Number(expirationTime) - currentTime;
  }
}
