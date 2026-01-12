import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadChildren: () =>
    import("./mis-manage/mis-manage.module").then(
      (m) => m.MisManageModule
    ) 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MISRoutingModule { }
