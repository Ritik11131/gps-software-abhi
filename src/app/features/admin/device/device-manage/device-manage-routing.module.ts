import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceManageComponent } from './pages/device-manage/device-manage.component';
import { DeviceDetailsComponent } from './component/device/device-details/device-details.component';
import { AdvanceSettingComponent } from './component/device/advance-setting/advance-setting.component';
import { MoveDeviceComponent } from './component/device/move-device/move-device.component';
import { CreateFitmentComponent } from './component/device/create-fitment/create-fitment.component';
import { DeviceMakerComponent } from './pages/device-maker-manage/device-maker.component';
import { AddDeviceMakerComponent } from './component/device-maker/add-device-maker/add-device-maker.component';
import { DeviceTypeManageComponent } from './pages/device-type-manage/device-type-manage.component';
import { AddDeviceTypeComponent } from './component/device-type/add-device-type/add-device-type.component';
import { DeviceBulkUploadComponent } from './component/device-bulk-upload/device-bulk-upload.component';
import { DeviceLogComponent } from './component/device-log/device-log.component';
import { BulkActivatedDeviceComponent } from './component/bulk-activated-device/bulk-activated-device.component';
import { DeviceSummaryListComponent } from './component/device-summary/device-summary-list/device-summary-list.component';
import { AdminDeviceDetailComponent } from './component/admin-device-detail/admin-device-detail.component';
import { DeviceCommandManageComponent } from './pages/device-command-manage/device-command-manage.component';
import { AddDeviceCommandComponent } from './component/device-command/add-device-command/add-device-command.component';

const routes: Routes = [
  {
    path: 'device-manage', component: DeviceManageComponent,
    children: [
      {
        path: ':id/:CustomerId/:deviceId/add-device', component: DeviceDetailsComponent
      },
      {
        path: ':id/:CustomerId/add-device', component: DeviceDetailsComponent
      },
      {
        path: ':id/:CustomerId/:deviceId/move', component: MoveDeviceComponent
      },
      {
        path: ':id/:CustomerId/:deviceId/device-details', component: DeviceDetailsComponent
      },
      {
        path: ':id/:CustomerId/:deviceId/advance-settings', component: AdvanceSettingComponent
      },
      {
        path: ':id/:CustomerId/:deviceId/create-fitment', component: CreateFitmentComponent
      },
    
    ]
  },
  {
    path:'device-maker',component:DeviceMakerComponent,
    children: [
      {
        path:'add-device-maker',component:AddDeviceMakerComponent
      },{
        path:'edit-device-maker/:id',component:AddDeviceMakerComponent
      }
    ]
  },
  {
    path:'device-type',component:DeviceTypeManageComponent,
    children: [
      {
        path:'add-device-type',component:AddDeviceTypeComponent
      },{
        path:'edit-device-type/:id',component:AddDeviceTypeComponent
      }
    ]
  },

  {
    path:'device-command',component:DeviceCommandManageComponent,
    children: [
      {
        path:'add-device-command',component:AddDeviceCommandComponent
      }
    ]
  },
  {
    path: 'bulk-upload', component: DeviceBulkUploadComponent
  },
  {
    path: 'device-log', component: DeviceLogComponent
  },
  {
    path: 'bulk-activated', component: BulkActivatedDeviceComponent
  },
  {
    path: 'device-summary', component: DeviceSummaryListComponent
  },
  {
    path: 'admin-device-detail', component: AdminDeviceDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceManageRoutingModule { }
