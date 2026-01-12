import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointSummaryManageRoutingModule } from './point-summary-manage-routing.module';
import { PointSummaryManageComponent } from './pages/point-summary-manage/point-summary-manage.component';
import { PointSummaryListComponent } from './component/point-summary-list/point-summary-list.component';
import { PointSummaryFilterComponent } from './component/point-summary-filter/point-summary-filter.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { PointSummaryDeatilsComponent } from './component/point-summary-deatils/point-summary-deatils.component';
import { ResellerLibertiesComponent } from './component/reseller-liberties/reseller-liberties.component';


@NgModule({
  declarations: [
    PointSummaryManageComponent,
    PointSummaryListComponent,
    PointSummaryFilterComponent,
    PointSummaryDeatilsComponent,
    ResellerLibertiesComponent
  ],
  imports: [
    CommonModule,
    PointSummaryManageRoutingModule,
    SharedModule
  ]
})
export class PointSummaryManageModule { }
