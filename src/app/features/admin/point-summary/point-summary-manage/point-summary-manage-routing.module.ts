import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PointSummaryManageComponent } from './pages/point-summary-manage/point-summary-manage.component';
import { ResellerLibertiesComponent } from './component/reseller-liberties/reseller-liberties.component';

const routes: Routes = [
  {
    path:'point-summary-manage',component:PointSummaryManageComponent
  },
  {
    path:'reseller-liberties',component:ResellerLibertiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointSummaryManageRoutingModule { }
