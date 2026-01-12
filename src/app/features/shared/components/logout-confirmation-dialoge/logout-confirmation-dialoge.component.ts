import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SessionService } from 'src/app/features/http-services/session.service';

@Component({
  selector: 'app-logout-confirmation-dialoge',
  templateUrl: './logout-confirmation-dialoge.component.html',
  styleUrls: ['./logout-confirmation-dialoge.component.scss']
})
export class LogoutConfirmationDialogeComponent {
  title: any;
  content: any;
  primaryActionLabel: any;
  secondaryActionLabel: any;
  service: any
  Type:any

  constructor(
    private bsmodalservice: BsModalService,
    public sessionService: SessionService,
  ) { }

  ok() {
    if(this.Type == 'Customer'){
      this.bsmodalservice.hide();
      setTimeout(() => {
        this.sessionService.logout();
      }, 500)
      
    }else{
      this.bsmodalservice.hide();
        setTimeout(() => {
          this.sessionService.adminlogout();
        }, 500)
    }
  }

  cancel() {
    this.bsmodalservice.hide()
  }
}
