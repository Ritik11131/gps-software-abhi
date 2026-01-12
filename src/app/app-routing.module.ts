import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepoListComponent } from './features/shared/components/depo-list/depo-list.component';
import { HomePageComponent } from './features/shared/components/home-page/home-page.component';
import { SiteHeaderComponent } from './features/shared/layouts/components/site-header/site-header.component';
import { MainLayoutComponent } from './features/shared/layouts/main-layout/main-layout/main-layout.component';
import { LoginComponent } from './features/shared/user/login/login.component';
import { ManageUserComponent } from './features/shared/company/pages/manage-user/manage-user.component';
import { AuthGuard } from './features/http-services/auth.guard';
import { AdminMainLayoutComponent } from './features/shared/layouts/admin-main-layout/admin-main-layout.component';
import { AdminGuard } from './features/http-services/admin.guard';
import { OpenTrackingComponent } from './features/shared/user/open-tracking/open-tracking.component';
import { PageNotFoundComponent } from './features/shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: "login",
    component: LoginComponent
  },
  { path: 'oT/:key', component: OpenTrackingComponent },

  {
    path: "admin",
    canActivate: [AuthGuard],
    component: AdminMainLayoutComponent,
    loadChildren: () =>
      import("./features/admin/admin.module").then(
        (m) => m.AdminModule
      ),
  },
  {
    path: "user",
    canActivate: [AuthGuard, AdminGuard],
    component: MainLayoutComponent,
    loadChildren: () =>
      import("./features/users/users.module").then(
        (m) => m.UsersModule
      ),
  },
  {
    path: '**', component: PageNotFoundComponent
  }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
