import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageTrackingRoutingModule } from './manage-tracking-routing.module';
import { GroupTrackingComponent } from './pages/group-tracking/group-tracking.component';
import { LiveTrackingComponent } from './pages/live-tracking/live-tracking.component';
import { HistoryTrackingComponent } from './pages/history-tracking/history-tracking.component';
import { OverSpeedComponent } from './pages/over-speed/over-speed.component';
import { TripReportComponent } from './pages/trip-report/trip-report.component';
import { SharedModule } from 'src/app/features/shared/shared.module';


@NgModule({
  declarations: [
    GroupTrackingComponent,
    LiveTrackingComponent,
    HistoryTrackingComponent,
    OverSpeedComponent,
    TripReportComponent
  ],
  imports: [
    CommonModule,
    ManageTrackingRoutingModule,
    SharedModule
  ]
})
export class ManageTrackingModule { }
