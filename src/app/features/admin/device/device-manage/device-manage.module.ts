import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceManageRoutingModule } from './device-manage-routing.module';
import { DeviceManageComponent } from './pages/device-manage/device-manage.component';
import { DeviceFitlerComponent } from './component/device-fitler/device-fitler.component';
import { DeviceListComponent } from './component/device-list/device-list.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { DeviceDetailsComponent } from './component/device/device-details/device-details.component';
import { AdvanceSettingComponent } from './component/device/advance-setting/advance-setting.component';
import { MoveDeviceComponent } from './component/device/move-device/move-device.component';
import { RechargePointComponent } from './component/device/recharge-point/recharge-point.component';
import { ActivatePointComponent } from './component/device/activate-point/activate-point.component';
import { MatMenuModule } from '@angular/material/menu';
import { ModifiedRechargeComponent } from './component/device/modified-recharge/modified-recharge.component';
import { DeviceCheckComponent } from './component/device/device-check/device-check.component';
import { CreateFitmentComponent } from './component/device/create-fitment/create-fitment.component';
import { DeviceMakerComponent } from './pages/device-maker-manage/device-maker.component';
import { DeviceMakerListComponent } from './component/device-maker/device-maker-list/device-maker-list.component';
import { AddDeviceMakerComponent } from './component/device-maker/add-device-maker/add-device-maker.component';
import { DeviceTypeManageComponent } from './pages/device-type-manage/device-type-manage.component';
import { AddDeviceTypeComponent } from './component/device-type/add-device-type/add-device-type.component';
import { DeviceTypeListComponent } from './component/device-type/device-type-list/device-type-list.component';
import { ShowFitmentComponent } from './component/device/show-fitment/show-fitment.component';
import { DeviceBulkUploadComponent } from './component/device-bulk-upload/device-bulk-upload.component';
import { FillOdometerComponent } from './component/device/fill-odometer/fill-odometer.component';
import { DeviceLogComponent } from './component/device-log/device-log.component';
import { BulkActivatedDeviceComponent } from './component/bulk-activated-device/bulk-activated-device.component';
import { BulkActivatedFilterComponent } from './component/bulk-activated-filter/bulk-activated-filter.component';
import { DeviceLogMapComponent } from './component/device-log-map/device-log-map.component';
import { DeviceSummaryListComponent } from './component/device-summary/device-summary-list/device-summary-list.component';
import { DeviceSummaryFilterComponent } from './component/device-summary/device-summary-filter/device-summary-filter.component';
import { AdminDeviceDetailComponent } from './component/admin-device-detail/admin-device-detail.component';
import { AdminDeviceFilterComponent } from './component/admin-device-filter/admin-device-filter.component';
import { DeviceCommandManageComponent } from './pages/device-command-manage/device-command-manage.component';
import { DeviceCommandListComponent } from './component/device-command/device-command-list/device-command-list.component';
import { AddDeviceCommandComponent } from './component/device-command/add-device-command/add-device-command.component';


@NgModule({
  declarations: [
    DeviceManageComponent,
    DeviceFitlerComponent,
    DeviceListComponent,
    DeviceDetailsComponent,
    AdvanceSettingComponent,
    MoveDeviceComponent,
    RechargePointComponent,
    ActivatePointComponent,
    ModifiedRechargeComponent,
    DeviceCheckComponent,
    CreateFitmentComponent,
    DeviceMakerComponent,
    DeviceMakerListComponent,
    AddDeviceMakerComponent,
    DeviceTypeManageComponent,
    AddDeviceTypeComponent,
    DeviceTypeListComponent,
    ShowFitmentComponent,
    DeviceBulkUploadComponent,
    FillOdometerComponent,
    DeviceLogComponent,
    BulkActivatedDeviceComponent,
    BulkActivatedFilterComponent,
    DeviceLogMapComponent,
    DeviceSummaryListComponent,
    DeviceSummaryFilterComponent,
    AdminDeviceDetailComponent,
    AdminDeviceFilterComponent,
    DeviceCommandManageComponent,
    DeviceCommandListComponent,
    AddDeviceCommandComponent,
  ],
  imports: [
    CommonModule,
    DeviceManageRoutingModule,
    MatMenuModule,
    SharedModule,
   

  ]
})
export class DeviceManageModule { }
