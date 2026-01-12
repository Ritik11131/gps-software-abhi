import { Component } from '@angular/core';
import { SimOperatorService } from '../../services/sim-operator.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sim-bill-summary',
  templateUrl: './sim-bill-summary.component.html',
  styleUrls: ['./sim-bill-summary.component.scss']
})
export class SimBillSummaryComponent {
  columns: any;
  searchKeyword:any
  page = 1;
  count = 0;
  tableSize = 25;
  tableSizes = [25, 50, 100];
  spinnerLoading: boolean = false;
  selecteStatus:any
  statusData:any = [
    {value:'ACTIVE',text:'Active'},
    {value:'ACTIVATED_ON_TEST_MODE',text:'Activated On Test Mode'},
    {value:'ACTIVE_AND_INITIAL',text:'Active And Initial'},
    {value:'ACTIVE_AND_SAFE_CUSTODY',text:'Active And Safe Custody'},
    {value:'ACTIVE_AND_TEMP_DISCONNECT',text:'Active And Temp Disconnect'},
    {value:'INITIAL',text:'Initial'},
    {value:'IN_PROGRESS',text:'In Progress'},
    {value:'SAFE_CUSTODY',text:'Safe Custody'},
    {value:'SUSPENDED',text:'Suspended'},
    {value:'TEMP_DISCONNECT',text:'Temp Disconnect'},
  ]
  billSummaryList: any;
  constructor(private simOperatorService: SimOperatorService,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit() {
    this.setInitialTable()
    this.selecteStatus = 'ACTIVE'
    this.getSimStatusList()
  }

  setInitialTable() {
    this.columns = [
      { key: '', title: 'Mobile No.' },
      { key: '', title: 'Sim Id' },
      { key: '', title: 'Imsi' },
      { key: '', title: 'Basket Id' },
      { key: '', title: 'Circle Name' },
      { key: '', title: 'Plan Code' },
      { key: '', title: 'Data Type' },
      { key: '', title: 'Data Unit' },
      { key: '', title: 'Onboarding Date' },
      { key: '', title: 'Active Date' },
      { key: '', title: 'Operator Name' },
      { key: '', title: 'Customer Name' },
      { key: '', title: 'Dealer Name' },
    ]
  }

  onselected(event:any){
    this.selecteStatus = event
    this.getSimStatusList()
  }

  getSimStatusList(){
    this.billSummaryList = []
    this.spinnerLoading = true
    let payload = {
      status:this.selecteStatus,
      page:this.page,
      pagesize:this.tableSize
    }
    this.simOperatorService.getSimBillSummary(payload).subscribe((res:any)=>{
      this.billSummaryList = res?.Result?.Data?.Data
      this.count = res?.Result?.Data?.TotalRecords
      this.spinnerLoading = false
    })
  }

   /**
   * table data change
   * @param event 
   */
   onTableDataChange(event: any) {
    this.page = event;
    this.getSimStatusList()
  };

  formatOnboardingDate(dateStr: string): string | null {
    return this.datePipe.transform(dateStr, 'dd/MM/yyyy HH:mm:ss');
  }
}
