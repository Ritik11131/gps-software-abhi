import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PointSummaryService } from '../../services/point-summary.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-reseller-liberties',
  templateUrl: './reseller-liberties.component.html',
  styleUrls: ['./reseller-liberties.component.scss']
})
export class ResellerLibertiesComponent {

  libertiesForm!:FormGroup
  spinnerLoading : boolean = false
  columns: any;
  page = 1;
  count = 0;
  tableSize = 10;
  libertiesList:any

  constructor(
    private fb: FormBuilder,
    private pointSummaryService: PointSummaryService,
   
  ){}
  ngOnInit() {
    this.setInitialForm()
    this.setInitialTable()
  }

  setInitialForm() {
    this.libertiesForm = this.fb.group({
      type: ['All', [Validators.required]],
      fromDate: [new Date(), [Validators.required]],
      toDate: [new Date(), [Validators.required]]
    })
    
  }

  setInitialTable() {
    this.columns = [
      { key: 'Date Time', title: 'Date Time' },
      { key: 'Point Type', title: 'Point Type' },
      { key: 'Trans Type', title: 'Trans Type' },
      { key: 'Expenditure', title: 'Expenditure' },
      { key: 'Balance', title: 'Balance' },
      { key: 'Remarks', title: 'Remarks' },
      { key: 'Details', title: 'Details' },
    ]
  }


  /**
    * table data change
    * @param event 
    */
  onTableDataChange(event: any) {
    this.page = event;
  };


  Submit(formValue: any) {
    if (this.libertiesForm.invalid) {
      this.libertiesForm.markAllAsTouched();
      return;
    }
    console.log("test",formValue);
    
  }
}
