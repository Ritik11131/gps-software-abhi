import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewAdminDashboardComponent } from './pages/new-admin-dashboard/new-admin-dashboard.component';
import { AdminHistoryTrackingComponent } from './new-dashboard-component/admin-history-tracking/admin-history-tracking.component';
import { AdminHistoryTrackingV2Component } from './new-dashboard-component/admin-history-tracking-v2/admin-history-tracking-v2.component';

const routes: Routes = [
  // {path: 'dashboard', component: AdminDashboardComponent},
  {path: 'dashboard', component: NewAdminDashboardComponent},
  {path: 'history-tracking/:cusId/:id', component: AdminHistoryTrackingV2Component},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardManageRoutingModule { }
