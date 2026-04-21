import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() {
  }
  constructor(
    private swUpdate: SwUpdate
  ) {
    if (environment.production && this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.promptUser();
      });
    }
  }

  promptUser() {
    if (confirm('A new version of the app is available. Would you like to update?')) {
      this.swUpdate.activateUpdate().then(() => {
        // Trigger a soft refresh or simply inform the user to refresh the page.
        alert('The app will update when you Refersh the application.');
      });
    }
  }
}
