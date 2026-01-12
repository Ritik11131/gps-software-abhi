import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, OnInit, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, from, Observable, of, switchMap } from "rxjs";
import { get, set, del, clear } from "idb-keyval";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private behaviorSubjects: Map<string, BehaviorSubject<any>>;
  private selectedAccount = new BehaviorSubject<any>(null);
  cartData: any = {};

  constructor(@Inject(PLATFORM_ID) protected platformID: Object) {
    this.behaviorSubjects = new Map<string, BehaviorSubject<any>>();
    this.getItem("miniCartCount").subscribe((res) => {
      this.cartData = res;
    });
  }

  setselectedAccount(data: any) {
    this.selectedAccount.next(data);
  }
  getselectedAccount() {
    return this.selectedAccount.asObservable();
  }

  /**
   * Returns the behaviorSubject by identifier. If it's not handled a new one is created but not pre-filled with any value.
   * @param identifier The indexdb identifier
   */
  private getBehaviorSubject(identifier: string): BehaviorSubject<any> {
    let behaviorSubject = this.behaviorSubjects.get(identifier);
    if (!behaviorSubject) {
      behaviorSubject = new BehaviorSubject<any>(null);
      this.behaviorSubjects.set(identifier, behaviorSubject);
    }
    return behaviorSubject;
  }

  /**
   * Fetches an item from indexdb
   * @param identifier Identifier of the storage object. Can be anything but for common used objects have a look at TYPE-Identifiers
   */
  private fetchItem(identifier: string): Observable<any> {
    const behaviorSubject = this.getBehaviorSubject(identifier);
    return from(
      new Promise((resolve, reject) => {
        if (isPlatformBrowser(this.platformID)) {
          get(identifier).then((value: any) => {
            behaviorSubject.next(value);
            resolve(behaviorSubject);
          });
        } else {
          behaviorSubject.next(null);
          resolve(behaviorSubject);
        }
      })
    ).pipe(
      switchMap((result: any) => {
        return of(result);
      })
    );
  }

  /**
   * Gets an item from indexdb
   * @param identifier Identifier of the storage object. Can be anything but for common used objects have a look at TYPE-Identifiers
   */
  public getItem(identifier: string): Observable<any> {
    return this.fetchItem(identifier).pipe(
      switchMap((payload: any) => {
        return payload;
      })
    );
  }

  /**
   * Stores an item and emits the new value to all its subscribers
   * @param identifier indexdb identifier
   * @param object the object that should be stored.
   */
  public setItem(identifier: string, object: any): void {
    if (isPlatformBrowser(this.platformID)) {
      set(identifier, object).then(() => {
        this.getBehaviorSubject(identifier).next(object);
      });
    }
  }

  public removeItem(identifier: string): any {
    if (isPlatformBrowser(this.platformID)) {
      return new Promise((resolve) => {
        del(identifier).then(() => {
          this.getBehaviorSubject(identifier).next(null);
        });
        resolve(true);
      });
    }
  }

  /**
   * Clears the indexdb and tells all subscribers of all items that the value is now null.
   */
  public clear() {
    if (isPlatformBrowser(this.platformID)) {
      clear().then(() => {
        this.behaviorSubjects.forEach(
          (behaviorSubject: BehaviorSubject<any>) => {
            behaviorSubject.next(null);
          }
        );
      });
    }
  }

 
  setItems(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItems(key: string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeItems(key: string) {
    localStorage.removeItem(key);
  }
  groupvehicles : boolean = true
  groupByvehicle(event : any){
    this.groupvehicles = event
  }
  grouping(){
return this.groupvehicles
  }
  start : boolean = false
  startTracking(event : any){
    this.start = event
  }
  tracking(){
    return this.start
  }

  alertData : boolean =  false
  setAlertValue(event : any){
this.alertData= event
  }
  returnalertValue(){
    return this.alertData
  }
}
