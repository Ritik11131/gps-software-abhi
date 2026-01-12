import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserLiveTrackingComponent } from './pages/user-live-tracking/user-live-tracking.component';

const routes: Routes = [
  // {
  //   path:"summary", component:DashboardComponent
  // },
   {
    path: 'summary', component: UserLiveTrackingComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardSummaryRoutingModule { }
