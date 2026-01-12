import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerManageRoutingModule } from './customer-manage-routing.module';
import { CustomerComponent } from './component/customer/customer.component';
import { CustomerManageComponent } from './pages/customer-manage/customer-manage.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { ManagePlaneComponent } from './component/customer-details/manage-plane/manage-plane.component';
import { ModifyCustomerComponent } from './component/customer-details/modify-customer/modify-customer.component';
import { NewDeviceComponent } from './component/customer-details/new-device/new-device.component';
import { DeleteCustomerComponent } from './component/customer-details/delete-customer/delete-customer.component';
import { AddCustomerComponent } from './component/customer-details/add-customer/add-customer.component';
import { NewUserComponent } from './component/customer-details/new-user/new-user.component';
import { RechargeComponent } from './component/customer-details/recharge/recharge.component';
import { ShiftCustomerComponent } from './component/customer-details/shift-customer/shift-customer.component';
import { PlanModifyComponent } from './component/customer-details/plan-modify/plan-modify.component';
import { AlertSettingComponent } from './component/customer-details/alert-setting/alert-setting.component';


@NgModule({
  declarations: [
    CustomerComponent,
    AddCustomerComponent,
    CustomerManageComponent,
    ManagePlaneComponent,
    ModifyCustomerComponent,
    NewDeviceComponent,
    DeleteCustomerComponent,
    NewUserComponent,
    RechargeComponent,
    ShiftCustomerComponent,
    PlanModifyComponent,
    AlertSettingComponent
  ],
  imports: [
    CommonModule,
    CustomerManageRoutingModule,
    SharedModule
  ]
})
export class CustomerManageModule { }
