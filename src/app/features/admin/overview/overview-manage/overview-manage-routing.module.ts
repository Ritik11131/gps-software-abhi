import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';
import { SellComponent } from './components/vehicle-details/sell/sell.component';
import { BulkSaleComponent } from './components/vehicle-details/bulk-sale/bulk-sale.component';
import { ModifyComponent } from './components/vehicle-details/modify/modify.component';
import { MoveComponent } from './components/vehicle-details/move/move.component';
import { RechargeComponent } from './components/vehicle-details/recharge/recharge.component';
import { ExpireDayComponent } from './components/vehicle-details/expire-day/expire-day.component';

const routes: Routes = [
  {
    path: 'admin-overview', component: OverviewComponent,
    children: [
      {
        path : '', pathMatch: "full", redirectTo: "sell"
      },
      {
        path: 'sell', component: SellComponent, 
      },
      {
        path: 'bulk-sale', component: BulkSaleComponent
      },
      {
        path: 'modify', component: ModifyComponent
      },
      {
        path: 'move', component: MoveComponent
      },
      {
        path: 'recharge', component: RechargeComponent
      },
      {
        path: 'expire-date', component: ExpireDayComponent
      },
    ]

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewManageRoutingModule { }
