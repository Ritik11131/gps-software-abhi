import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PointSummaryDeatilsComponent } from '../point-summary-deatils/point-summary-deatils.component';

@Component({
  selector: 'app-point-summary-list',
  templateUrl: './point-summary-list.component.html',
  styleUrls: ['./point-summary-list.component.scss']
})
export class PointSummaryListComponent {
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [25, 50, 100];
  columns: any;
  selectedDealerId: any;
  selectedCustomerId: any;
  spinnerLoading: boolean = false
  pointSummaryData: any;
  bsModalRef!: BsModalRef


  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.setInitialValue();
  }

  setInitialValue() {
    this.columns = [
      { key: 'Date Time', title: 'Date Time' },
      { key: 'Point Type', title: 'Point Type' },
      { key: 'Trans Type', title: 'Trans Type' },
      { key: 'Expenditure', title: 'Expenditure' },
      { key: 'Balance', title: 'Balance' },
      { key: 'Remarks', title: 'Remarks' },
      { key: 'Customer Name', title: 'Customer Name' },
      { key: 'Installation', title: 'Installation' },
      { key: 'Vehicle No', title: 'Vehicle No' },
      { key: 'Description ', title: 'Description ' },
      { key: 'Point Recharge Due', title: 'Point Recharge Due' },
      { key: 'Customer Recharge Due', title: 'Customer Recharge Due' },
      // { key: 'Details', title: 'Details' },
    ]
  }


  confirm(event: any) {
    this.pointSummaryData = event
  }

  /**
    * table data change
    * @param event 
    */
  onTableDataChange(event: any) {
    this.page = event;
  };

  openDetailsOpenpop(details:any) {
    const initialState: ModalOptions = {
      initialState: {
        details: details
      },
    };
    this.bsModalRef = this.modalService.show(
      PointSummaryDeatilsComponent,
      Object.assign(initialState, {
        id: 'confirmationModal',
        class: 'modal-md modal-dialog-centered',
      })
    );
  }
}
