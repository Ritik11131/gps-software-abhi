import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveTrackingComponent } from './pages/live-tracking/live-tracking.component';
import { GroupTrackingComponent } from './pages/group-tracking/group-tracking.component';
import { HistoryTrackingComponent } from './pages/history-tracking/history-tracking.component';

const routes: Routes = [
  {
    path:'live-tracking', component:LiveTrackingComponent
  },
  {
    path:"Traking_all", component:GroupTrackingComponent
  },
  {
    path:"replay/:id", component:LiveTrackingComponent
  },
  {
    path:"replay", component:LiveTrackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageTrackingRoutingModule { }
