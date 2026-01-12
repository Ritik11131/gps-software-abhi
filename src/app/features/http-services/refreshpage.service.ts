import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RefreshpageService {

  constructor(private router: Router) { }

  checkAndRedirect(parentUrl: string) {
   this.router.navigateByUrl(parentUrl)
  }
}
