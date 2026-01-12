import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceManageService } from '../../../service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-modified-recharge',
  templateUrl: './modified-recharge.component.html',
  styleUrls: ['./modified-recharge.component.scss']
})
export class ModifiedRechargeComponent {
  selectedDealer: any
  selectedCustomer: any
  tittle: any
  deviceId: any;
  spinnerLoading: boolean = false
  Id: any
  deviceData: any
  modifyRechargeForm!: FormGroup;
  type: any

  constructor(
    private fb: FormBuilder,
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService,
    private router: Router,
    private bsmodelService: BsModalService,
    private refreshCustomerService: RefreshCustomerService
  ) {

  }

  ngOnInit() {
    this.setInitialValue()
  }

  setInitialValue() {
    this.modifyRechargeForm = this.fb.group({
      rechargeDate: [new Date(this.deviceData?.PointValidity?.NextRechargeDue), [Validators.required, Validators.pattern('')]],
      customerDate: [new Date(this.deviceData?.PointValidity?.CustomerRechargeDue), [Validators.required, Validators.pattern('')]],
    })
  }

  submit(formValue: any) {
    let payload = {
      "Id": Number(this.Id),
      "DeviceId": Number(this.deviceId),
      "CurrentPointType": 2,
      "NextRechargeDue": formatDate(formValue.rechargeDate, 'yyyy-MM-ddT00:00:00', 'en-US'),
      "CustomerRechargeDue": formatDate(formValue.customerDate, 'yyyy-MM-ddT00:00:00', 'en-US')
    }
    this.deviceManageService.updateRecharge(payload, this.Id).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        if( this.type != 'admin') {
          this.router.navigateByUrl('admin/device/device-manage')
        } 
        this.bsmodelService.hide();
        this.refreshCustomerService.announceCustomerAdded();

      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })


  }

  cancel() {
    this.bsmodelService.hide()
  }

}
