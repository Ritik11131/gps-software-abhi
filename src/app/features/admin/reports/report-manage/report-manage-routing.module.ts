import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportManageComponent } from './pages/report-manage/report-manage.component';

const routes: Routes = [
  {
    path:'report-manage',component:ReportManageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportManageRoutingModule { }
