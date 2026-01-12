import { Component, Input } from '@angular/core';
import { SimOperatorService } from '../../services/sim-operator.service';

@Component({
  selector: 'sim-list',
  templateUrl: './sim-list.component.html',
  styleUrls: ['./sim-list.component.scss'],
})
export class SimListComponent {
  @Input() simOperatorList:any
  columns: any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20, 50, 100];
  spinnerLoading: boolean = false;
  searchKeyword: any;

  constructor() {}

  ngOnInit() {
    this.setInitialTable();
  }

  setInitialTable() {
    this.columns = [
      { key: 'Name', title: ' Name' },
      { key: 'Mobile No', title: 'Mobile No' },
      // { key: 'Email', title: 'Email' },
      { key: 'Basket Id', title: 'Id' },
      { key: 'Basket Name', title: 'Name' },
      { key: 'Parent Basket Id', title: 'Parent Id' },
      { key: 'Creation Date', title: 'Creation Date' },
      { key: 'Total Sim', title: 'Total' },
      { key: 'Active Sim', title: 'Active' },
      { key: 'Availabel Sim', title: 'Availabel' },
      { key: 'Test Mode Sim', title: 'Test Mode' },
      { key: 'Safe Custody', title: 'Safe Custody' },
      { key: 'In Active Sim', title: 'In Active' },
      { key: 'In Progress Sim', title: 'In Progress' },
      { key: 'Suspended Sim', title: 'Suspended' },
    ];
  }

  onTableDataChange(event: any) {
    this.page = event;
  }
}
