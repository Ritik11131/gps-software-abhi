import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardSummaryRoutingModule } from './dashboard-summary-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleDetailsComponent } from './components/vehicle-details/vehicle-details.component';
import { VehicleLocationsComponent } from './components/vehicle-locations/vehicle-locations.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { VehicleStatusComponent } from './components/vehicle-status/vehicle-status.component';
import { SwiperComponent } from './components/swiper/swiper.component';
import { AlertReportComponent } from './components/alert-report/alert-report.component';
import { CustomerDeviceDetailsComponent } from './components/customer-device-details/customer-device-details.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { UserLiveTrackingComponent } from './pages/user-live-tracking/user-live-tracking.component';



@NgModule({
    declarations: [
        DashboardComponent,
        VehicleListComponent,
        VehicleDetailsComponent,
        VehicleLocationsComponent,
        VehicleStatusComponent,
        SwiperComponent,
        AlertReportComponent,
        CustomerDeviceDetailsComponent,
        UserLiveTrackingComponent,
    ],
    imports: [
        CommonModule,
        DashboardSummaryRoutingModule,
        SharedModule,
        GoogleMapsModule
    ],
    exports : [
        SwiperComponent,
        VehicleListComponent
    ]
})
export class DashboardSummaryModule { }
