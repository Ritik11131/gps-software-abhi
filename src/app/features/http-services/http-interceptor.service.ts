import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { SessionService } from "./session.service";
import { TokenService } from "./token.service";
import { StorageService } from "./storage.service";
import { UserSwitchService } from "../shared/services/user-switch.service";

@Injectable({
  providedIn: "root",
})
export class HttpInterceptorsService implements HttpInterceptor {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private sessionService: SessionService,
    private storageService: StorageService,
    private userSwitchService: UserSwitchService,
  ) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip interception for these URLs
    if (httpRequest.url.startsWith("https://router.project-osrm.org/route/v1/driving/") || 
        httpRequest.url.startsWith("https://api.ipify.org?format=json")) {
      return next.handle(httpRequest); 
    }
    
    // Use the active token from the user switch stack (last entry).
    // This ensures that when we switch users, the interceptor immediately
    // picks up the new user's JWT without needing a page reload.
    const token = this.userSwitchService.getActiveToken() || this.tokenService.getToken();

    if (token) {
      const authReq = httpRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(authReq).pipe(
        catchError((error: any) => {
          if (error.status === 401) {
           this.sessionService.logout();;
            this.router.navigate(['/login']);
          }
          
          if (this.invalidTokenError(error) || this.unAuthorizedError(error)) {
           this.sessionService.logout();;
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }

    // For requests without token
    return next.handle(httpRequest);
  }


  private invalidTokenError(error: any): boolean {
    const errorsArray = error.error?.errors;
    return errorsArray?.some((object: any) => object.type === "InvalidTokenError") ?? false;
  }

  private unAuthorizedError(error: any): boolean {
    const errorsArray = error.error?.errors;
    return errorsArray?.some((object: any) => object.type === "UnauthorizedError") ?? false;
  }
}
