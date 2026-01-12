import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportManageRoutingModule } from './report-manage-routing.module';
import { ReportManageComponent } from './pages/report-manage/report-manage.component';
import { ReportManageListComponent } from './component/report-manage-list/report-manage-list.component';
import { ReportManageFilterComponent } from './component/report-manage-filter/report-manage-filter.component';
import { SharedModule } from 'src/app/features/shared/shared.module';


@NgModule({
  declarations: [
    ReportManageComponent,
    ReportManageListComponent,
    ReportManageFilterComponent
  ],
  imports: [
    CommonModule,
    ReportManageRoutingModule,
    SharedModule
  ]
})
export class ReportManageModule { }
