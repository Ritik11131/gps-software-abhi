import { Component } from '@angular/core';
import { AdminProfileService } from '../../services/admin-profile.service';

@Component({
  selector: 'app-dealer-point-summary',
  templateUrl: './dealer-point-summary.component.html',
  styleUrls: ['./dealer-point-summary.component.scss']
})
export class DealerPointSummaryComponent {
tableData: any;
  balancePointCount: any;
  newPointCount: number = 0;
  renewalPointCount: number = 0;
  summaryList: any;
constructor(private adminProfileService:AdminProfileService){

}

ngOnInit(){
this.setInitialValue()
this.getBalancePoint()
this.getLastSummary()
}

setInitialValue() {
  this.tableData = [
    { key: 'keyValue', val: 'Date Time' },
    { key: 'keyValue', val: 'Point Type' },
    { key: 'keyValue', val: 'Trans Type' },
    { key: 'keyValue', val: 'Count' },
  ]
}
 
getBalancePoint(){
  this.adminProfileService.balancePointCount().subscribe((res:any)=>{
    this.balancePointCount = res?.body?.Result?.Data
    this.balancePointCount?.forEach((val:any)=>{
      if(val?.PointName == 'New points'){
        this.newPointCount = val?.Count
      }else if(val?.PointName == 'Recharge Points'){
        this.renewalPointCount = val?.Count
      }
    })
  })
}

getLastSummary(){
  this.adminProfileService.lastTransaction().subscribe((res:any)=>{
    this.summaryList = res?.body?.Result?.Data
    
  })
}

}
