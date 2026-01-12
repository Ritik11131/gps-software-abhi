import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  public decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  public storeToken(token: string): void {
    localStorage.setItem('jwt', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  public removeToken(): void {
    localStorage.removeItem('jwt');
  }

}
