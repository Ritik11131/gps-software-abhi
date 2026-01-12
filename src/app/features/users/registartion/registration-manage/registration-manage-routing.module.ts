import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from './pages/department/department.component';
import { RoleComponent } from './pages/role/role.component';
import { AddDeviceModelComponent } from './pages/add-device-model/add-device-model.component';
import { UsersComponent } from './pages/users/users.component';
import { GeoFenceComponent } from './pages/geo-fence/geo-fence.component';
import { AddRouteComponent } from './pages/add-route/add-route.component';
import { AssetsComponent } from './pages/assets/assets.component';

const routes: Routes = [
  {
    path:'Add_Department', component:DepartmentComponent
  },
  {
    path:'Add_Rolenew', component:RoleComponent
  },
  {
    path:'Add_Device', component:AddDeviceModelComponent
  },
  {
    path:"Add_User" , component:UsersComponent
  },
  {
    path:"Add_Geo_Fence" , component:GeoFenceComponent
  },
  {
    path:"Add_Device_Model" , component:AssetsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationManageRoutingModule { }
