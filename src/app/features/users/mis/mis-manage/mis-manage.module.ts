import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisManageRoutingModule } from './mis-manage-routing.module';
import { ReportComponent } from './pages/report/report.component';
import { ReportsDetailsComponent } from './pages/components/reports-details/reports-details.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { ReportsFilterComponent } from './pages/components/reports-filter/reports-filter.component';


@NgModule({
  declarations: [
    ReportComponent,
    ReportsFilterComponent,
    ReportsDetailsComponent
  ],
  imports: [
    CommonModule,
    MisManageRoutingModule,
    SharedModule
  ]
})
export class MisManageModule { }
