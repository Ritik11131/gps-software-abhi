import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';

import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { AccessWizardComponent } from './pages/access-wizard/access-wizard.component';
import { DeviceManagementComponent } from './pages/device-management/device-management.component';
import { UserVehiclePermissionComponent } from './pages/user-vehicle-permission/user-vehicle-permission.component';
import { DashboardAccessComponent } from './pages/dashboard-access/dashboard-access.component';
import { EditDeviceComponent } from './pages/edit-device/edit-device.component';
import { SharedModule } from 'src/app/features/shared/shared.module';



@NgModule({
    declarations: [
        ChangePasswordComponent,
        AccessWizardComponent,
        DeviceManagementComponent,
        UserVehiclePermissionComponent,
        DashboardAccessComponent,
        EditDeviceComponent
    ],
    imports: [
        CommonModule,
        ManageRoutingModule,
        SharedModule
    ]
})
export class ManageModule { }
