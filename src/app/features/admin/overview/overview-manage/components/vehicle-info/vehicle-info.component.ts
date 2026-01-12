import { Component } from '@angular/core';

@Component({
  selector: 'vehicle-info',
  templateUrl: './vehicle-info.component.html',
  styleUrls: ['./vehicle-info.component.scss']
})
export class VehicleInfoComponent {

  navigation= [
    {
      name: 'Sell',
      path: 'sell'
    },
    {
      name: 'Bulk Sale',
      path: 'bulk-sale'
    },
    {
      name: 'Move',
      path: 'move'
    },
    {
      name: 'Recharge',
      path: 'recharge'
    },
    // {
    //   name: 'Modify',
    //   path: 'modify'
    // },
    {
      name: 'Modify Expiry Date',
      path: 'expire-date'
    },
  ]
}
