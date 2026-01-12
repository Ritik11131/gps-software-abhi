import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { CustomerManageService } from '../../../serices/customer-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-shift-customer',
  templateUrl: './shift-customer.component.html',
  styleUrls: ['./shift-customer.component.scss']
})
export class ShiftCustomerComponent {

  dealerData: any;
  dealerId: any;
  customerId: any;
  selectedDelear: any
  routePath:any = 'admin/customer/customer-manage'
  constructor(
    private sharedService: SharedService,
    private activeRoute: ActivatedRoute,
    private customerService: CustomerManageService,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService
  ) { 
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('cusID');
      this.getDealerlist()
    });
  }

  ngOnInit() {
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("cusID")
    this.getDealerlist()
  }


  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
    })
  }

  submit() {
    if (this.selectedDelear == null || this.selectedDelear =='') {
      
      return;
    }
    let payload = {
      "CustomerID": Number(this.customerId),
      "OldDealer": Number(this.dealerId),
      "NewDealer": this.selectedDelear
    }

    this.customerService.shiftCustomer(payload).subscribe((res: any) => {
      if(res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.router.navigateByUrl('admin/customer/customer-manage')
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
    })
  }

  cancel(event:any) {
    event.preventDefault()
  }
}
