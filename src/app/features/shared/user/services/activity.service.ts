import { isPlatformBrowser } from "@angular/common";
import {
  ElementRef,
  HostListener,
  Inject,
  Injectable,
  PLATFORM_ID,
  TemplateRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import {
  delay,
  fromEvent,
  interval,
  map,
  of,
  ReplaySubject,
  Subject,
  Subscription,
  take,
} from "rxjs";
import { SessionService } from "src/app/features/http-services/session.service";
import { TokenService } from "src/app/features/http-services/token.service";

@Injectable({
  providedIn: "root",
})
export class ActivityService {
  beforeExpired!: TemplateRef<any>;
  expired!: TemplateRef<any>;
  userActive = true;
  inactiveTimeInSeconds = 1200;
  timeLeftAfterInactive = 60;
  timer: any;
  beforeModalRef?: BsModalRef;
  afterModalRed?: BsModalRef;
  modalOpen = false;
  userResumedSession = new Subject<boolean>();
  secondsLeft = new ReplaySubject<number | undefined>(1);
  interval: Subscription | undefined;
  isBrowser: boolean;

  constructor(
    private modalService: BsModalService,
    private sessionService: SessionService,
    @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      let url = new URL(window.location.href);
      if (
        url.searchParams.get("code") === null &&
        url.searchParams.get("state") === null
      ) {
        if (sessionStorage.getItem("inactiveSession") === "true") {
          setTimeout(() => {
            this.userIsInactive();
          }, 1000);
        }
      }
    }
    if (this.isBrowser) {
      fromEvent(document, "mousemove").subscribe(() => this.onInteraction());
      fromEvent(document, "touchstart").subscribe(() => this.onInteraction());
      fromEvent(document, "keydown").subscribe(() => this.onInteraction());
      this.startTimer();
    }
  }

  userIsActive(): boolean {
    return this.userActive;
  }
 
  startTimer() {
    let timeInMS = this.inactiveTimeInSeconds * 1000;
    this.timer = setTimeout(() => {
      this.userIsInactive();
    }, timeInMS);
  }
  userIsInactive() {    
    if (this.isBrowser && localStorage.getItem('token')!== null ) {
      if (!this.modalOpen) {
        let expireTime = 0;
        if (sessionStorage.getItem("sessionExpireTime") !== null) {
          expireTime = Number(sessionStorage.getItem("sessionExpireTime"));
        } else {
          expireTime = new Date().getTime() + this.timeLeftAfterInactive * 1000;
          sessionStorage.setItem("sessionExpireTime", expireTime.toString());
        }
        let timeLeft = expireTime - new Date().getTime();
        if (timeLeft <= 0) {
          this.sessionIsExpired();
        } else {
          this.beforeModalRef = this.modalService.show(this.beforeExpired, {
            class: "modal-dialog-centered",
            backdrop: "static",
            keyboard: false,
          });
          this.modalOpen = true;
          this.userActive = false;
          sessionStorage.setItem("inactiveSession", "true");
          timeLeft = Math.floor(timeLeft / 1000);

          this.interval = interval(1000)
            .pipe(
              take(timeLeft),
              map((count) => timeLeft - count - 1)
            )
            .subscribe((seconds) => {
              this.secondsLeft.next(seconds);
              if (seconds === 0) {
                this.sessionIsExpired();
              }
            });
        }
      }
    }
  }
  sessionIsExpired() {
    this.beforeModalRef?.hide();
    this.modalService.show(this.expired, {
      class: "modal-dialog-centered",
      backdrop: "static",
      keyboard: false,
    });
    this.modalOpen = true;
  }
  getSecondsLeft() {
    return this.secondsLeft;
  }

  onInteraction() {
    if (this.userActive) {
      clearInterval(this.timer);
      this.startTimer();
      this.userActive = true;
    }
  }
  endSession() {
    this.sessionService.logout();
  }
  releaseSessionLock() {
    if (this.isBrowser) {
      sessionStorage.removeItem("sessionExpireTime");
    }
  }

  continueSession() {
    this.userActive = true;

    this.beforeModalRef?.hide();
    this.modalOpen = false;
    this.userResumedSession.next(true);
    this.interval?.unsubscribe();
    this.secondsLeft.next(undefined);
    if (this.isBrowser) {
      sessionStorage.removeItem("inactiveSession");
      sessionStorage.setItem("inactiveSession", "false");
    }

    this.releaseSessionLock();
  }

  passTemplate(beforeExpired: TemplateRef<any>, expired: TemplateRef<any>) {
    this.beforeExpired = beforeExpired;
    this.expired = expired;
  }
}
