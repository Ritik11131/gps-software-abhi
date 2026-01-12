import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimOperatorManageComponent } from './pages/sim-operator-manage/sim-operator-manage.component';
import { SimStatusComponent } from './components/sim-status/sim-status.component';
import { SimBillSummaryComponent } from './components/sim-bill-summary/sim-bill-summary.component';

const routes: Routes = [
  {
    path:'sim-operator-manage',component:SimOperatorManageComponent
  },
  {
    path:'sim-status',component:SimStatusComponent
  },
  {
    path:'bill-summary',component:SimBillSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimOperatorManageRoutingModule { }
