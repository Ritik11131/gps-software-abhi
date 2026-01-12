import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { AccessWizardComponent } from './pages/access-wizard/access-wizard.component';
import { DeviceManagementComponent } from './pages/device-management/device-management.component';
import { UserVehiclePermissionComponent } from './pages/user-vehicle-permission/user-vehicle-permission.component';
import { DashboardAccessComponent } from './pages/dashboard-access/dashboard-access.component';

const routes: Routes = [
  {
    path:'change_password', component:ChangePasswordComponent
  },
  {
    path:"AccessWizard", component:AccessWizardComponent
  },
  {
    path:'device', component:DeviceManagementComponent
  },
  {
    path:'User_Vehicle_Acces', component:UserVehiclePermissionComponent
  },
  {
    path:"DashBoardAccess" , component:DashboardAccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
