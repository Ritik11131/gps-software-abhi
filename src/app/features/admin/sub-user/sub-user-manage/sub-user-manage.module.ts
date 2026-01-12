import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubUserManageRoutingModule } from './sub-user-manage-routing.module';
import { SubUserManageComponent } from './pages/sub-user-manage/sub-user-manage.component';
import { SubuserListComponent } from './component/subuser-list/subuser-list.component';
import { SubuserFilterComponent } from './component/subuser-filter/subuser-filter.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { ModifySubuserComponent } from './component/subuser-details/modify-subuser/modify-subuser.component';
import { SubuserVehicleComponent } from './component/subuser-details/subuser-vehicle/subuser-vehicle.component';
import { AddSubuserComponent } from './component/subuser-details/add-subuser/add-subuser.component';


@NgModule({
  declarations: [
    SubUserManageComponent,
    SubuserListComponent,
    SubuserFilterComponent,
    ModifySubuserComponent,
    SubuserVehicleComponent,
    AddSubuserComponent
  ],
  imports: [
    CommonModule,
    SubUserManageRoutingModule,
    SharedModule
  ]
})
export class SubUserManageModule { }
