import { Component, Input, SimpleChanges } from '@angular/core';
import { SimOperatorService } from '../../services/sim-operator.service';

@Component({
  selector: 'sim-dashboard',
  templateUrl: './sim-dashboard.component.html',
  styleUrls: ['./sim-dashboard.component.scss']
})
export class SimDashboardComponent {
  @Input() dashboardCount:any
  countData: any;

  constructor(){}

  ngOnInit(){
  }

  ngOnChanges(changes: SimpleChanges): void {    
    if (changes['dashboardCount']) {
      this.setCardData(changes['dashboardCount'].currentValue);
    }
  }

  setCardData(data:any){
    this.countData = [
      {name:'Baskets',count:data?.totalBaskets ? data?.totalBaskets : 0},
      {name:'Sims',count:data?.totalSims ? data?.totalSims : 0},
      {name:'Active Sims',count:data?.totalActiveSims ? data?.totalActiveSims : 0},
      {name:'Available Sims',count:data?.totalAvailableSims ? data?.totalAvailableSims : 0},
      {name:'Test Mode Sims',count:data?.totalTestModeSims ? data?.totalTestModeSims : 0},
      {name:'Safe Custody Sims',count:data?.totalSafeCustodySims ? data?.totalSafeCustodySims : 0},
      {name:'Inactive Sims',count:data?.totalInActiveSims ? data?.totalInActiveSims : 0},
      {name:'In Progress Sims',count:data?.totalInProgressSims ? data?.totalInProgressSims : 0},
      {name:'Suspended Sims',count:data?.totalSuspendedSims ? data?.totalSuspendedSims : 0},
      {name:'Sim In Baskets',count:data?.totalSimsInBaskets ? data?.totalSimsInBaskets : 0},
    ]
  }
}
