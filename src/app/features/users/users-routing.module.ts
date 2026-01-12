import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../http-services/auth.guard';
import { AdminGuard } from '../http-services/admin.guard';
import { MainLayoutComponent } from '../shared/layouts/main-layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: "notification",
    loadChildren: () =>
      import("./notification/notification.module").then(
        (m) => m.NotificationModule
      ),
  },
  {
    path: "managment",
    loadChildren: () =>
      import("./management/management.module").then(
        (m) => m.ManagementModule
      ),
  },
  {
    path: "tracking",
    loadChildren: () =>
      import("./tracking/tracking.module").then(
        (m) => m.TrackingModule
      ),
  },

  {
    path: "registration",
    loadChildren: () =>
      import("./registartion/registartion.module").then(
        (m) => m.RegistartionModule
      ),
  },

  {
    path: "reports",
    loadChildren: () =>
      import("./mis/mis.module").then(
        (m) => m.MISModule
      ),
  },
  {
    path: "geofacne",
    loadChildren: () =>
      import("./geofance/geofance.module").then(
        (m) => m.GeofanceModule
      ),
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profie/profie.module").then(
        (m) => m.ProfieModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
