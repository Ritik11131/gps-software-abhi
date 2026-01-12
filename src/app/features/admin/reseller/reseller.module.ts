import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResellerRoutingModule } from './reseller-routing.module';
import { ResellerComponent } from './page/reseller/reseller.component';
import { ResellerListComponent } from './component/reseller-list/reseller-list.component';
import { SharedModule } from '../../shared/shared.module';
import { AddResellerComponent } from './component/add-reseller/add-reseller.component';
import { PointManagementComponent } from './component/point-management/point-management.component';
import { ResellerRechargeComponent } from './component/reseller-recharge/reseller-recharge.component';
import { AddEmployeeComponent } from './component/add-employee/add-employee.component';


@NgModule({
  declarations: [
    ResellerComponent,
    ResellerListComponent,
    AddResellerComponent,
    PointManagementComponent,
    ResellerRechargeComponent,
    AddEmployeeComponent
  ],
  imports: [
    CommonModule,
    ResellerRoutingModule,
    SharedModule
  ]
})
export class ResellerModule { }
