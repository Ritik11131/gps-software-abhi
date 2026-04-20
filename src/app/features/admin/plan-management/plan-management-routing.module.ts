import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanListComponent } from './component/plan-list/plan-list.component';

const routes: Routes = [
  {
    path: 'plan-manage',
    component: PlanListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanManagementRoutingModule { }
