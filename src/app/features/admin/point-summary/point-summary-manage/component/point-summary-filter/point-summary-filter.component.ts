import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { formatDate } from '@angular/common';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { PointSummaryService } from '../../services/point-summary.service';
import { StorageService } from 'src/app/features/http-services/storage.service';

@Component({
  selector: 'app-point-summary-filter',
  templateUrl: './point-summary-filter.component.html',
  styleUrls: ['./point-summary-filter.component.scss']
})
export class PointSummaryFilterComponent {
  @Output() filterValue = new EventEmitter();

  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer:any
  pointSummaryForm!: FormGroup;
  pointSummaryData: any;
  spinnerLoading : boolean = false
  selectDealerCustomer: any;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private pointSummaryService: PointSummaryService,
    private notificationService:NotificationService,
    private storageService: StorageService
   
  ){}
  ngOnInit() {
    this.getDealerlist()
    this.setInitialValue()
    this.checkDealerCustomer()
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res:any) => {
      this.selectDealerCustomer = res
    })
  }

  setInitialValue() {
    this.pointSummaryForm = this.fb.group({
      type: ['All', [Validators.required]],
      trans: ['Both', [Validators.required]],
      reseller: ['', [Validators.required]],
      fromDate: [new Date(), [Validators.required]],
      toDate: [new Date(), [Validators.required]]
    })
    
  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer: this.dealerData[0].Id;
        this.pointSummaryForm.controls['reseller'].setValue(this.selectedDealer)
      }
    })
  }

  Submit(formValue: any) {
    if (this.pointSummaryForm.invalid) {
      this.pointSummaryForm.markAllAsTouched();
      return;
    }
    this.spinnerLoading = true
    let payload = {
      "DealerId": Number(formValue?.reseller),
      "FromTime": formatDate(formValue.fromDate,'yyyy-MM-dd', 'en-US'),
      "PointType": formValue.type == null ? formValue.type : Number(formValue.type),
      "ToTime": formatDate(formValue.toDate,'yyyy-MM-dd', 'en-US'),
      "TransType": formValue.trans == null ? formValue.trans : Number(formValue.trans),
    }
    this.pointSummaryService.pointSummary(payload).subscribe((res:any) => {
      this.spinnerLoading = false
      if(res?.body?.ResponseMessage == "Success") {
        this.pointSummaryData = res?.body?.Result?.Data;
        this.filterValue.emit(this.pointSummaryData)
      }
    })
  }

}
