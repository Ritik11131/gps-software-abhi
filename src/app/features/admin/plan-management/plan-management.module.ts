import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanManagementRoutingModule } from './plan-management-routing.module';
import { PlanListComponent } from './component/plan-list/plan-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PlanListComponent
  ],
  imports: [
    CommonModule,
    PlanManagementRoutingModule,
    SharedModule
  ]
})
export class PlanManagementModule { }
