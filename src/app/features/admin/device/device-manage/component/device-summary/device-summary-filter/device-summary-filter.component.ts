import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'device-summary-filter',
  templateUrl: './device-summary-filter.component.html',
  styleUrls: ['./device-summary-filter.component.scss']
})
export class DeviceSummaryFilterComponent {
  @Output() filterValue = new EventEmitter();
  @Input() activateData: any[] = [];
  dealerData: any;
  selectedDealer: any;
  selectedStatus: any
  fromDate:any = new Date()
  toDate:any = new Date()
  selectStatus = [
    {id:1, value:'installation_on',name:'Installation On' },
    {id:1, value: 'Expire_Soon', name: 'Expire Soon' },
    {id:1, value:'epired',name:'Expired' },
  ]
  selectDealerCustomer: any;
  constructor(
    private sharedService: SharedService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.getDealerlist()
    this.checkDealerCustomer()
    this.selectedStatus = this.selectStatus[0].value
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res:any) => {
      this.selectDealerCustomer = res
    })
  }

  onStatusSelect(event: any) {
    this.selectedStatus = event
    this.filterValue.emit({
      dealerId: this.selectedDealer,
      statusType: this.selectedStatus?.value,
      value:this.selectedStatus?.id
    })
  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer: this.dealerData[0].Id;
        this.filterValue.emit({
          dealerId: this.selectedDealer,
          statusType: this.selectedStatus?.value,
          value:this.selectStatus[0].id
        })
      }
    })
  }

  onDealerSelect(dealerId: any) {
    this.selectedDealer = dealerId;
    this.selectDealerCustomer = null;
    this.filterValue.emit({
      dealerId: this.selectedDealer,
      statusType: this.selectedStatus?.value,
      value:this.selectedStatus?.id,
      type:'ResetData'
    })
  }

  isSubmitted = false;
  submit(){
    this.isSubmitted = true;
    if(!this.selectedDealer || !this.selectedStatus) {
      return
    }
    this.filterValue.emit({
      dealerId: this.selectedDealer,
      statusType: this.selectedStatus?.value,
      value:this.selectedStatus?.id ? this.selectedStatus?.id : 1
    })
  }
}
