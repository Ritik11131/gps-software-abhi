import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  combineLatest,
  filter,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { menuType } from "../../constant/menu/menu.type"

import { StorageService } from "src/app/features/http-services/storage.service";

@Injectable({
  providedIn: "root",
})
export class MenuConfigService {
  // Use Side Nav replace below line with private menuConfig = new BehaviorSubject<string>(menuType.sideNav);
  // Use Top Nav replace below line with  private menuConfig = new BehaviorSubject<string>(menuType.topNav);
  public headerOffSetHeight = new BehaviorSubject<any>(0);
  private menuConfig = new BehaviorSubject<string>(menuType.sideNav);
  currentState = this.menuConfig.asObservable();
  moduleName = "";
  constructor(
    private storageService: StorageService
  ) {}


  
}
