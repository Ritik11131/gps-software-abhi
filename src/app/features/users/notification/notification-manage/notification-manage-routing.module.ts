import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertSettingComponent } from './component/alert-setting/alert-setting.component';

const routes: Routes = [
  {path: 'alert-setting', component: AlertSettingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationManageRoutingModule { }
