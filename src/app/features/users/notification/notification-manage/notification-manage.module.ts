import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationManageRoutingModule } from './notification-manage-routing.module';
import { NotificationManageComponent } from './pages/notification-manage/notification-manage.component';
import { AlertSettingComponent } from './component/alert-setting/alert-setting.component';
import { SharedModule } from 'src/app/features/shared/shared.module';


@NgModule({
  declarations: [
    NotificationManageComponent,
    AlertSettingComponent
  ],
  imports: [
    CommonModule,
    NotificationManageRoutingModule,
    SharedModule
  ]
})
export class NotificationManageModule { }
