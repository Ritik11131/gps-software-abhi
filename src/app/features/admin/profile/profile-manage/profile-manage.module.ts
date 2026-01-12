import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileManageRoutingModule } from './profile-manage-routing.module';
import { DealerPointSummaryComponent } from './component/dealer-point-summary/dealer-point-summary.component';
import { ModifyPasswordComponent } from './component/modify-password/modify-password.component';
import { DealerProfileComponent } from './component/dealer-profile/dealer-profile.component';
import { ProfileManageComponent } from './pages/profile-manage/profile-manage.component';
import { SharedModule } from 'src/app/features/shared/shared.module';


@NgModule({
  declarations: [
    DealerPointSummaryComponent,
    ModifyPasswordComponent,
    DealerProfileComponent,
    ProfileManageComponent,
  ],
  imports: [
    CommonModule,
    ProfileManageRoutingModule,
    SharedModule
  ]
})
export class ProfileManageModule { }
