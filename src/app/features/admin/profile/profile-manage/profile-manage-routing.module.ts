import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileManageComponent } from './pages/profile-manage/profile-manage.component';

const routes: Routes = [
  {
    path:'profile-manage-user',component:ProfileManageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileManageRoutingModule { }
