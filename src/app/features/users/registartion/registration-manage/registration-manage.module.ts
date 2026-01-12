import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationManageRoutingModule } from './registration-manage-routing.module';
import { DepartmentComponent } from './pages/department/department.component';
import { RoleComponent } from './pages/role/role.component';
import { AssetsComponent } from './pages/assets/assets.component';
import { UsersComponent } from './pages/users/users.component';
import { GeoFenceComponent } from './pages/geo-fence/geo-fence.component';
import { AddRouteComponent } from './pages/add-route/add-route.component';
import { AddDeviceModelComponent } from './pages/add-device-model/add-device-model.component';


@NgModule({
  declarations: [
    DepartmentComponent,
    RoleComponent,
    AssetsComponent,
    UsersComponent,
    GeoFenceComponent,
    AddRouteComponent,
    AddDeviceModelComponent
  ],
  imports: [
    CommonModule,
    RegistrationManageRoutingModule
  ]
})
export class RegistrationManageModule { }
