import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUserComponent } from './pages/manage-user/manage-user.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';

const routes: Routes = [

  {
    
    path:'add-new-user',
    component:AddUserComponent
  },
  {
    
    path:'manageuser',
    component:ManageUserComponent
  },
  {
    
    path:'edit-user',
    component:EditUserComponent
  },
  {
    
    path:'user-detail',
    component:UserDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
