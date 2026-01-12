import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimOperatorManageRoutingModule } from './sim-operator-manage-routing.module';
import { SimOperatorManageComponent } from './pages/sim-operator-manage/sim-operator-manage.component';
import { SimDashboardComponent } from './components/sim-dashboard/sim-dashboard.component';
import { SimListComponent } from './components/sim-list/sim-list.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { SimStatusComponent } from './components/sim-status/sim-status.component';
import { SimBillSummaryComponent } from './components/sim-bill-summary/sim-bill-summary.component';


@NgModule({
  declarations: [
    SimOperatorManageComponent,
    SimDashboardComponent,
    SimListComponent,
    SimStatusComponent,
    SimBillSummaryComponent
  ],
  imports: [
    CommonModule,
    SimOperatorManageRoutingModule,
    SharedModule
  ]
})
export class SimOperatorManageModule { }
