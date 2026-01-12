import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './pages/report/report.component';

const routes: Routes = [
  {path: 'vehicle-report/:id', component: ReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisManageRoutingModule { }
