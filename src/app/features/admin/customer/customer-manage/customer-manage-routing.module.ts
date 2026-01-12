import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './component/customer/customer.component';
import { CustomerManageComponent } from './pages/customer-manage/customer-manage.component';
import { AddCustomerComponent } from './component/customer-details/add-customer/add-customer.component';
import { ManagePlaneComponent } from './component/customer-details/manage-plane/manage-plane.component';
import { ModifyCustomerComponent } from './component/customer-details/modify-customer/modify-customer.component';
import { NewDeviceComponent } from './component/customer-details/new-device/new-device.component';
import { DeleteCustomerComponent } from './component/customer-details/delete-customer/delete-customer.component';
import { NewUserComponent } from './component/customer-details/new-user/new-user.component';
import { RechargeComponent } from './component/customer-details/recharge/recharge.component';
import { ShiftCustomerComponent } from './component/customer-details/shift-customer/shift-customer.component';
import { AlertSettingComponent } from './component/customer-details/alert-setting/alert-setting.component';

const routes: Routes = [
  {
    path: 'customer-manage', component: CustomerManageComponent,
    children: [
      { path: ':id/add-customer', component: AddCustomerComponent },
      { path: ':id/:cusID/manage-plan', component: ManagePlaneComponent },
      { path: ':id/:cusID/modify-customer', component: ModifyCustomerComponent },
      { path: ':id/:cusID/new-user', component: NewUserComponent },
      { path: ':id/:cusID/new-device', component: NewDeviceComponent },
      { path: ':id/:cusID/recharge', component: RechargeComponent },
      { path: ':id/:cusID/shift-customer', component: ShiftCustomerComponent },
      { path: ':id/:cusID/:userID/alert-setting', component: AlertSettingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerManageRoutingModule { }
