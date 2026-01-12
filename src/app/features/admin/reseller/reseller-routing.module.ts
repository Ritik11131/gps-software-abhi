import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResellerComponent } from './page/reseller/reseller.component';
import { AddResellerComponent } from './component/add-reseller/add-reseller.component';
import { PointManagementComponent } from './component/point-management/point-management.component';
import { ResellerRechargeComponent } from './component/reseller-recharge/reseller-recharge.component';
import { AddEmployeeComponent } from './component/add-employee/add-employee.component';

const routes: Routes = [
  {
    path:'reseller-raster', component: ResellerComponent,
    children: [
      {path: ':id/modify-reseller', component: AddResellerComponent},
      {path: ':id/add-employee', component: AddEmployeeComponent},
      {path: ':id/Point-Management', component: PointManagementComponent},
      {path: ':id/recharge', component: ResellerRechargeComponent},
      {path: 'add-reseller', component: AddResellerComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResellerRoutingModule { }
