import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("./reseller/reseller.module").then(
        (m) => m.ResellerModule
      ),
  },
  {
    path: "overview",
    loadChildren: () =>
      import("./overview/overview.module").then(
        (m) => m.OverviewModule
      ),
  },
  {
    path: "customer",
    loadChildren: () =>
      import("./customer/customer.module").then(
        (m) => m.CustomerModule
      ),
  },
  {
    path: "subuser",
    loadChildren: () =>
      import("./sub-user/sub-user.module").then(
        (m) => m.SubUserModule
      ),
  },
  {
    path: "device",
    loadChildren: () =>
      import("./device/device.module").then(
        (m) => m.DeviceModule
      ),
  },
  {
    path: "reports",
    loadChildren: () =>
      import("./reports/reports.module").then(
        (m) => m.ReportsModule
      ),
  },
  {
    path: "point-summary",
    loadChildren: () =>
      import("./point-summary/point-summary.module").then(
        (m) => m.PointSummaryModule
      ),
  },

  {
    path: "admin-profile",
    loadChildren: () =>
      import("./profile/profile.module").then(
        (m) => m.ProfileModule
      ),
  },
  {
    path: "sim",
    loadChildren: () =>
      import("./sim-operator/sim-operator.module").then(
        (m) => m.SimOperatorModule
      ),
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
