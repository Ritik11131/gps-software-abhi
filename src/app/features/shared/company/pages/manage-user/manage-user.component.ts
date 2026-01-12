import { Component } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { CompanyService } from '../../services/company.service';
import {searchByCompany, status, limit} from '../../../../shared/constant/company'
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
})
export class ManageUserComponent {
  searchByCompany = searchByCompany;
  status = status;
  limit = limit;
  public columns!: Columns[];
  public configuration!: Config;
  spinnerLoading: any = false;
  companyList: any;
  totlRecords: any;
  allquoteData: any;
  tableLoading: any = false ;
  alertType: any = "success";
  alertTrigger: any = false;
  alertData: any = {
    message: "success",
  };

  modalRef?: BsModalRef;
  constructor(private companyService: CompanyService,
    private modalService: BsModalService,) {}
  ngOnInit(): void {
    this.configuration= { ...DefaultConfig };
    this.configuration.checkboxes = false;
    this.configuration.tableLayout.striped = true;
    this.configuration.tableLayout.hover = false;
    this.configuration.paginationRangeEnabled = false;
    this.configuration.paginationEnabled = false;
    this.columns = [
     
      { key: 'Company Name', title: 'Company Name' },
      { key: 'Mobile Number', title: 'Mobile Number' },
      { key: 'Contact Person', title: 'Contact Person' },
      { key: 'Address', title: 'Address' },
      { key: 'Status', title: 'Status' },
      { key: 'delete', title: 'Action' },
    ];
    // this.getQuoteList(0);
  }
  data: any[] = [];
  pageIndex: number = 1;
  tableItemsSize: number = 10;
  startValue: number =
    this.pageIndex * this.tableItemsSize - (this.tableItemsSize - 1);
  lastValue: number = this.startValue + this.tableItemsSize - 1;
  onTableDataChange(event: any) {
    this.pageIndex = event;
    this.startValue =
      this.pageIndex * this.tableItemsSize - (this.tableItemsSize - 1);
    this.lastValue = this.startValue + this.tableItemsSize - 1;
    this.lastValue =
      this.lastValue > this.data.length ? this.data.length : this.lastValue;
  }

  param = {
    searchBy: '',
    searchValue: '',
    status: '',
    sortby: '',
    sortCode: 'desc',
    page: 0,
    limit: 10,
  };
  // getQuoteList(event: any) {
  //   // this.spinnerLoading = true;
  //   this.totlRecords = 0;
  //   this.allquoteData = [...[], ...[]];
    
  //   //this.tableLoading = true;
  //   // if (this.param.searchBy === '')
  //   this.companyService
  //     .getcompanylist(
  //       this.param
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         this.allquoteData = res?.result?.data
  //         this.totlRecords = res?.result?.pagination?.totalResults || 0;
     
  //        this.stopAlert()
  //       },
  //       error:
  //         (err: any) => {
  //           this.tableLoading = false;
  //         }

  //     });
  // }
  onTablePageChange(event: any) {
   
    this.param.page = event - 1;
    this.pageIndex = event;
    // this.getQuoteList(event - 1);
    
  }
  onSearchBY(event: any): void {    
    const value = event;
    this.param.searchBy = value == undefined ? '' : value;
  }
  onSearchQuotes(inputValue: any): void {
    this.param.searchValue = inputValue.target.value == undefined ? '' : inputValue.target.value;;

    // this.getQuoteList(0);

  }
  onStatusChange(event: any): void {

    
    this.param.status = event == undefined ? '' : event;
    // this.getQuoteList(0);

  }

  stopAlert() {
    this.spinnerLoading = false;
    setTimeout(() => {
      this.alertTrigger = false;
    }, 2000);
  }
  
    /**
     * delete emp id here
     * @param id 
     * @param name 
     */
    deleteComp(id: any, name: any) {
      this.openConfirmationModal({
        title: "Remove" + "-" + name,
        content: "Do you really want to Remove?",
        primaryActionLabel: "YES",
        secondaryActionLabel: "NO",
        onPrimaryAction: () => this.remove(id),
      });
    }
  
    /**
     * remove employee
     * @param payload 
     */
    remove(id : any) {      
      this.companyService
        .deleteCompany(id)
        .subscribe((res: any) => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          if (res?.body?.message == 'Success') {
            this.alertData = {
              message: "Company removed successfully",
            };
            this.alertType = "success";
            this.alertTrigger = true;
            this.stopAlert();
            // this.getQuoteList(0);
          }
        }),
        (err: any) => { };
    }
  
    /**
     * open confirmation popup for remove employee
     * @param data 
     */
    openConfirmationModal(data = {}) {
      const initialState: ModalOptions = {
        backdrop: true,
        ignoreBackdropClick: true,
        initialState: {
          ...data,
        },
      };
      this.modalRef = this.modalService.show(
        ConfirmationDialogComponent,
        Object.assign(initialState, {
          id: "confirmation",
          class: "modal-md modal-dialog-centered",
        })
      );
    }
}
