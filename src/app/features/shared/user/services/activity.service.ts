import { isPlatformBrowser } from "@angular/common";
import {
  Inject,
  Injectable,
  PLATFORM_ID,
} from "@angular/core";
import {
  Subject,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ActivityService {
  userActive = true;
  userResumedSession = new Subject<boolean>();
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  userIsActive(): boolean {
    return this.userActive;
  }

  continueSession() {
    this.userActive = true;
    this.userResumedSession.next(true);
    if (this.isBrowser) {
      sessionStorage.removeItem("inactiveSession");
    }
  }

  releaseSessionLock() {
    if (this.isBrowser) {
      sessionStorage.removeItem("sessionExpireTime");
    }
  }
}
