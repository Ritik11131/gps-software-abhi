import { Component } from '@angular/core';
import { SimOperatorService } from '../../services/sim-operator.service';

@Component({
  selector: 'app-sim-operator-manage',
  templateUrl: './sim-operator-manage.component.html',
  styleUrls: ['./sim-operator-manage.component.scss']
})
export class SimOperatorManageComponent {
  spinnerLoading: boolean = false;
  simOperatorList: any;
  dashboardCount: any;
constructor(private simOperatorService: SimOperatorService){}

ngOnInit(){
  this.getdashboardData()
}

getdashboardData() {
  this.spinnerLoading = true
  this.simOperatorService.getSimOperatorData().subscribe((res: any) => {
    this.spinnerLoading = false
    this.simOperatorList = res?.body?.Result?.data?.baskets;
    this.dashboardCount = res?.body?.Result?.data
  });
}
}
