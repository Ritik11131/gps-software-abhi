import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private _open = new BehaviorSubject<boolean>(false);
  currentState = this._open.asObservable();
  constructor() { }
  
  show() {
    this._open.next(true)
  }
  hide() {

    this._open.next(false)
  }
  
}
