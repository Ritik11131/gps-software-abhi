import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomerManageService } from 'src/app/features/admin/customer/customer-manage/serices/customer-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { SharedService } from 'src/app/features/http-services/shared.service';

@Component({
  selector: 'move-account',
  templateUrl: './move-account.component.html',
  styleUrls: ['./move-account.component.scss']
})
export class MoveAccountComponent {
  @Input() userData: any
  @Output() closePopup = new EventEmitter();
  dealerData: any;
  selectedDelear: any
  constructor(
    private sharedService: SharedService,
    private customerService: CustomerManageService,
    private notificationService: NotificationService,
  ) { 
  }

  ngOnInit() {
    this.getDealerlist()
  }


  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
    })
  }

  submit() {

    if(!this.selectedDelear) {
      return;
    }
    let payload = {
      "CustomerID": Number(this.userData?.Customer?.Id),
      "OldDealer": Number(this.userData?.Dealer?.Id),
      "NewDealer": this.selectedDelear
    }

    this.customerService.shiftCustomer(payload).subscribe((res: any) => {
      if(res?.body?.ResponseMessage == 'Success') {
        this.closePopup.emit(false)
        this.notificationService.showSuccess(res?.body?.Result?.Message);
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
    })
  }

  cancel(event:any) {
    this.closePopup.emit(false)
    this.selectedDelear = null
    event.preventDefault()
  }
}
