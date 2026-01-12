import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeofanceManageRoutingModule } from './geofance-manage-routing.module';
import { GeofanceComponent } from './pages/geofance/geofance.component';
import { GoefanceListComponent } from './component/goefance-list/goefance-list.component';
import { CreateGeofanceComponent } from './component/create-geofance/create-geofance.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { CreateGeofanceV2Component } from './component/create-geofance-v2/create-geofance-v2.component';


@NgModule({
  declarations: [
    GeofanceComponent,
    GoefanceListComponent,
    CreateGeofanceComponent,
    CreateGeofanceV2Component
  ],
  imports: [
    CommonModule,
    GeofanceManageRoutingModule,
    SharedModule
  ]
})
export class GeofanceManageModule { }
