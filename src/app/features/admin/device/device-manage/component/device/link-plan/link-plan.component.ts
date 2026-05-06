import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { DeviceManageService } from '../../../service/device-manage.service';

@Component({
  selector: 'app-link-plan',
  templateUrl: './link-plan.component.html',
  styleUrls: ['./link-plan.component.scss']
})
export class LinkPlanComponent implements OnInit {
  selectedDevices: any[] = [];
  plans: any[] = [];
  selectedPlanId: any = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans() {
    this.isLoading = true;
    this.deviceManageService.getCustomerPlans().subscribe((res: any) => {
      this.isLoading = false;
      if (res?.status === 200 && res?.body?.result === true) {
        this.plans = res?.body?.data || [];
      } else if (res?.result === true) {
        this.plans = res?.data || [];
      } else {
        this.plans = [];
      }
    });
  }

  linkPlan() {
    if (!this.selectedPlanId) {
      this.notificationService.showError('Please select a plan');
      return;
    }

    const deviceIds = this.selectedDevices.map((d: any) => d.id || d.Id);
    const payload = {
      device: deviceIds,
      planId: this.selectedPlanId
    };

    this.isSubmitting = true;
    this.deviceManageService.linkPlan(payload).subscribe((res: any) => {
      this.isSubmitting = false;
      if (res?.status === 200 || res?.result === true) {
        const msg = res?.body?.data || res?.data || 'Plan linked successfully';
        this.notificationService.showSuccess(msg);
        this.bsModalRef.hide();
      } else {
        const errMsg = res?.error?.message || res?.message || 'Failed to link plan';
        this.notificationService.showError(errMsg);
      }
    });
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
