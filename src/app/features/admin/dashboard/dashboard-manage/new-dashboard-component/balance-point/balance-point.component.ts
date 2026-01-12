import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AdminProfileService } from 'src/app/features/admin/profile/profile-manage/services/admin-profile.service';

@Component({
  selector: 'app-balance-point',
  templateUrl: './balance-point.component.html',
  styleUrls: ['./balance-point.component.scss']
})
export class BalancePointComponent {
  selectedDealer:any
  renewalPointCount: any;
  newPointCount:any;
  selectDealerName:any

  constructor(
    private bsmodalService: BsModalService
  ) {}
 
  cancel() {
    this.bsmodalService.hide()
  }
}
