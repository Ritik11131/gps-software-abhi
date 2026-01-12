import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewManageRoutingModule } from './overview-manage-routing.module';
import { OverviewComponent } from './pages/overview/overview.component';
import { AdminUserDetailsComponent } from './components/admin-user-details/admin-user-details.component';
import { AdminDeviceRemindComponent } from './components/admin-device-remind/admin-device-remind.component';
import { VehicleModelComponent } from './components/vehicle-model/vehicle-model.component';
import { VehicleInfoComponent } from './components/vehicle-info/vehicle-info.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { BulkSaleComponent } from './components/vehicle-details/bulk-sale/bulk-sale.component';
import { SellComponent } from './components/vehicle-details/sell/sell.component';
import { MoveComponent } from './components/vehicle-details/move/move.component';
import { RechargeComponent } from './components/vehicle-details/recharge/recharge.component';
import { ModifyComponent } from './components/vehicle-details/modify/modify.component';
import { ExpireDayComponent } from './components/vehicle-details/expire-day/expire-day.component';
import { MoveSelectDeviceOverviewComponent } from './components/vehicle-details/move-select-device-overview/move-select-device-overview.component';
import { OuterBulkSaleComponent } from './components/vehicle-details/outer-bulk-sale/outer-bulk-sale.component';
import { InnerBulkSaleComponent } from './components/vehicle-details/inner-bulk-sale/inner-bulk-sale.component';
import { AllCustomerDetailOverviewComponent } from './components/all-customer-detail-overview/all-customer-detail-overview.component';



@NgModule({
  declarations: [
    OverviewComponent,
    AdminUserDetailsComponent,
    AdminDeviceRemindComponent,
    VehicleModelComponent,
    VehicleInfoComponent,
    SellComponent,
    BulkSaleComponent,
    MoveComponent,
    RechargeComponent,
    ModifyComponent,
    ExpireDayComponent,
    MoveSelectDeviceOverviewComponent,
    OuterBulkSaleComponent,
    InnerBulkSaleComponent,
    AllCustomerDetailOverviewComponent
  ],
  imports: [
    CommonModule,
    OverviewManageRoutingModule,
    SharedModule,
  ]
})
export class OverviewManageModule { }
