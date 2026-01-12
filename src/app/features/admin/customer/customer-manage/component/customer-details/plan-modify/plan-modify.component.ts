import { Component } from '@angular/core';
import { CustomerManageService } from '../../../serices/customer-manage.service';

@Component({
  selector: 'app-plan-modify',
  templateUrl: './plan-modify.component.html',
  styleUrls: ['./plan-modify.component.scss']
})
export class PlanModifyComponent {
  serviceCharge = ['Device Purchase', 'Service', 'Device + Service', 'Device Rent']
  planDuration: any;


  constructor(
    private CustomerManageService: CustomerManageService
  ) {}

  ngOnInit() {
    this.getPlanDurationData()
  }

  getPlanDurationData() {
    this.CustomerManageService.customerPlanPeriod().subscribe((res: any) => {
      this.planDuration = res?.body?.Result?.Data;
    })
  }

}
