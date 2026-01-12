import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardManageRoutingModule } from './dashboard-manage-routing.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { CustomerComponent } from './component/customer/customer.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { VehicleOnMapComponent } from './component/vehicle-on-map/vehicle-on-map.component';
import { AllCustomerDetailsComponent } from './component/all-customer-details/all-customer-details.component';
import { NewAdminDashboardComponent } from './pages/new-admin-dashboard/new-admin-dashboard.component';
import { NewVehicleListComponent } from './new-dashboard-component/new-vehicle-list/new-vehicle-list.component';
import { NewVehicleOnMapComponent } from './new-dashboard-component/new-vehicle-on-map/new-vehicle-on-map.component';
import { BalancePointComponent } from './new-dashboard-component/balance-point/balance-point.component';
import { DashboardSummaryModule } from 'src/app/features/users/dashboard/dashboard-summary/dashboard-summary.module';
import { AdminHistoryTrackingComponent } from './new-dashboard-component/admin-history-tracking/admin-history-tracking.component';
import { AdminTripReportComponent } from './new-dashboard-component/admin-trip-report/admin-trip-report.component';
import { VehicleOnMapV2Component } from './new-dashboard-component/vehicle-on-map-v2/vehicle-on-map-v2.component';
import { AdminHistoryTrackingV2Component } from './new-dashboard-component/admin-history-tracking-v2/admin-history-tracking-v2.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    CustomerComponent,
    VehicleOnMapComponent,
    AllCustomerDetailsComponent,
    NewAdminDashboardComponent,
    NewVehicleListComponent,
    NewVehicleOnMapComponent,
    BalancePointComponent,
    AdminHistoryTrackingComponent,
    AdminTripReportComponent,
    VehicleOnMapV2Component,
    AdminHistoryTrackingV2Component,
  ],
  imports: [
    CommonModule,
    DashboardManageRoutingModule,
    SharedModule,
    DashboardSummaryModule
  ]
})
export class DashboardManageModule { }
