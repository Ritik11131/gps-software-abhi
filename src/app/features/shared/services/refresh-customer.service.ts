import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshCustomerService {

  private customerAddedSource = new Subject<void>();

  customerAdded$ = this.customerAddedSource.asObservable();

  constructor() {}

  announceCustomerAdded() {
    this.customerAddedSource.next();
  }
}
