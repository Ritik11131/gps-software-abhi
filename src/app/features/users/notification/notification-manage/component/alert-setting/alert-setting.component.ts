import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerManageService } from 'src/app/features/admin/customer/customer-manage/serices/customer-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'alert-setting',
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
  routePath:any = 'admin/customer/customer-manage';
  spinnerLoading : boolean = false;

  constructor(
    private customerService: CustomerManageService,
    private notificationService: NotificationService,
    private storageService: StorageService
  ) {
  };

  ngOnInit() {
    this.storageService.getItem("userDetail").subscribe((user: any) => {
      this.userId = user?.customerUserId;
      this.selectedDealerId = user?.dealerId
      if(this.userId) {

        this.getAlertSetting()
      }
    })
    

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
    this.spinnerLoading = true;
    let arrayData: any = []
    this.customerService.alertSetting(this.userId).subscribe((res: any) => {
       this.spinnerLoading = false;

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
        this.getAlertSetting()
      } else if(res?.error.ResponseMessage == "Failed") {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }
}
