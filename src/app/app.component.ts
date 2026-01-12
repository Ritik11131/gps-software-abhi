import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { PushNotificationService } from './features/http-services/push-notification.service';
import { ActivityService } from './features/shared/user/services/activity.service';
import { SessionService } from './features/http-services/session.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // constructor(private swUpdate: SwUpdate, private pushService: PushNotificationService) {}
  @ViewChild("beforeExpired")
  beforeExpired!: TemplateRef<any>;

  @ViewChild("expired")
  expired!: TemplateRef<any>;
  seconds: number | undefined;
  ngOnInit() {
    
   
  }
  constructor(
    private activityService: ActivityService,
    private sessionService: SessionService,
    private router: Router,
    private bsModerService : BsModalService,
    private swUpdate: SwUpdate
  ) {
    if (environment.production && this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.promptUser();
      });
    }
    
    activityService.secondsLeft.subscribe(
      (seconds) => (this.seconds = seconds)
    );
  }

  promptUser() {
    if (confirm('A new version of the app is available. Would you like to update?')) {
      this.swUpdate.activateUpdate().then(() => {
        // Trigger a soft refresh or simply inform the user to refresh the page.
        alert('The app will update when you Refersh the application.');
      });
    }
  }
  
  ngAfterViewInit(): void {
    this.activityService.passTemplate(this.beforeExpired, this.expired);
  }
  continueSession() {
    this.activityService.continueSession();
  }
  endSession() {
    this.activityService.endSession();
  }
  signIn() {
    this.bsModerService.hide()
    this.activityService.releaseSessionLock();
    this.sessionService.logout();
  }
}
