import { Component } from '@angular/core';
import { CustomerManageService } from '../../../serices/customer-manage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-alert-setting',
  templateUrl: './alert-setting.component.html',
  styleUrls: ['./alert-setting.component.scss']
})
export class AlertSettingComponent {
  tableData: any;
  userId: any;
  alertData: any
  isSelectedAlertId: any;
  selectedIndex: any;
  selectedData: any = [];
  selectedDealerId: any;
  routePath:any = 'admin/customer/customer-manage'

  constructor(
    private customerService: CustomerManageService,
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.userId = params.get('userID');
      this.selectedDealerId = this.activeRoute.snapshot.paramMap.get("id")

      if (this.userId) {
        this.getAlertSetting()
      }
    });
  };

  ngOnInit() {
    this.userId = this.activeRoute.snapshot.paramMap.get("userID");
    this.selectedDealerId = this.activeRoute.snapshot.paramMap.get("id")
    if (this.userId) {
      this.getAlertSetting()
    }

    this.setInitialValue()
  }

  setInitialValue() {
    this.tableData = [
      {
        key: '', value: 'Alert Type',
      },
      {
        key: '', value: 'Status'
      }
    ]
  }

  getAlertSetting() {
    let arrayData: any = []
    this.customerService.alertSetting(this.userId).subscribe((res: any) => {
      this.alertData = res?.body?.Result?.Data;
      this.alertData.forEach((alert: any) => {
        if (alert.status === 1) {
          arrayData.push(alert?.Id);
        } 
      });
      this.selectedData = arrayData;
    })
  }

  onCheckboxChange(event: any, data: any) {
    const isChecked = event.target.checked;
    this.isSelectedAlertId = data.Id;
  
    if (isChecked) {
      if (!this.selectedData.includes(this.isSelectedAlertId)) {
        this.selectedData.push(this.isSelectedAlertId);
      }
    } else {
      const index = this.selectedData.findIndex((x: any) => x === this.isSelectedAlertId);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }
  }

  submit() {
    let payload = {
      "AlertId":  this.selectedData,
      "UserId": this.userId,
      "dealer_id": this.selectedDealerId
    }
    
    this.customerService.alertsmapping(payload).subscribe((res:any) => {
      if(res?.body?.ResponseMessage == "Success") {
        this.notificationService.showSuccess(res?.body?.Result?.Data);
        this.router.navigateByUrl('admin/customer/customer-manage');
        this.refreshCustomerService.announceCustomerAdded();
      } else if(res?.error.ResponseMessage == "Failed") {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }
}
