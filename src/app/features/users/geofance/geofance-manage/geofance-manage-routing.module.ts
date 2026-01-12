import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeofanceComponent } from './pages/geofance/geofance.component';

const routes: Routes = [
  {
    path: 'list-geofence', component: GeofanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeofanceManageRoutingModule { }
