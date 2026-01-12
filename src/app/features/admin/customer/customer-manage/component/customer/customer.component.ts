import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { DeleteConfirmationComponent } from 'src/app/features/shared/components/delete-confirmation/delete-confirmation.component';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { CustomerManageService } from '../../serices/customer-manage.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { ClipboardService } from 'ngx-clipboard';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { RefreshpageService } from 'src/app/features/http-services/refreshpage.service';

@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {
  spinnerLoading: boolean = false
  columns!: Columns[];
  searchKeyword: any;
  dealerData: any;
  selectedDealer: any;
  customerData: any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [25, 50, 100];
  selectedDealerId: any;
  configuration!: Config;
  copy: boolean = false
  showCopyIcon: any
  urlPath = [
    {
      path: 'modify-customer',
      name: 'Modify Customer'
    },
    {
      path: 'manage-plan',
      name: 'Manage Plan'
    },
    {
      path: 'new-user',
      name: 'New User'
    },
    {
      path: 'new-device',
      name: 'New Device'
    },
    // {
    //   path: 'activation-deactivation',
    //   name: 'Activation/Deactivation'
    // },    
    {
      path: 'shift-customer',
      name: 'Shift Customer'
    },
    // {
    //   path: 'Delete',
    //   name: 'Delete Customer'
    // },
    {
      path: 'alert-setting',
      name: 'Alert Setting'
    },
  ]
  bsModelRef!: BsModalRef;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger | any;
  selectedCustomerValue: any;
  selectColor: any;
  index: any;
  loginId:any
  selectDealerCustomer: any;


  constructor(
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private bsmodelService: BsModalService,
    private CustomerManageService: CustomerManageService,
    private clipboardService: ClipboardService,
    private storageService: StorageService,
    private refreshpage: RefreshpageService
    ) { }

  ngOnInit() {
    this.getuserDetail()
    this.refreshpage.checkAndRedirect('/admin/customer/customer-manage');  

    this.refreshCustomerService.customerAdded$.subscribe(() => {
      this.getCustomerData(this.selectedDealerId)
    });
    this.setInitialTable();
    this.getDealerlist();
    this.checkDealerCustomer()
  }

  getuserDetail(){
    this.storageService.getItem("userDetail").subscribe((value:any)=>{
      if(value?.role === "2"){        
        this.urlPath = this.urlPath.filter(item => item.name !== 'Shift Customer');
      }
    })
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res:any) => {
      this.selectDealerCustomer = res
    })
  }

  setInitialTable() {
    this.columns = [
      { key: 'Company', title: 'Customer Name' },
      { key: 'Name', title: 'Login Id' },
      { key: 'Mobile No', title: 'Email' },
      { key: 'New Points', title: 'Contact No' },
      { key: 'Date Time', title: 'Creation Date' },
      { key: 'Status', title: 'Status' },
      { key: 'Action', title: 'Action' },
    ]
  }


  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer = this.selectDealerCustomer && this.selectDealerCustomer?.dealer ? this.selectDealerCustomer?.dealer: this.dealerData[0].Id;
        this.getCustomerData(this.selectedDealer);
      }
    })
  }

  copyContent(text: any, i: any) {
    this.clipboardService.copyFromContent(text)
    this.copy = true
    this.index = i
    this.notificationService.showSuccess('Copied')
  }

  onDealerSelect(dealerId: any) {    
    this.selectedDealerId = null;
    if (dealerId) {
      this.getCustomerData(dealerId);
    } else {
      this.customerData = []

    }
    this.router.navigateByUrl('admin/customer/customer-manage')
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    this.spinnerLoading = true;
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.body?.ResponseMessage == 'Success') {
        this.customerData = res?.body?.Result?.Data;
      } else {
        this.customerData = [];

      }
    });
  }

  /**
   * table data change
   * @param event 
   */
  onTableDataChange(event: any) {
    this.page = event;
  };

  confirm(event: any) {
    this.getCustomerData(event)
  }

  toggleDropdown(event: Event) {
    const target = event.currentTarget as HTMLElement;
    const dropdownContent = target.nextElementSibling;
    const allDropdowns = document.querySelectorAll('.dropdown-content');

    allDropdowns.forEach(dropdown => {
      if (dropdown !== dropdownContent && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
    });

    if (dropdownContent) {
      dropdownContent.classList.toggle('show');
    }

    window.onclick = function (event: any) {
      if (!event.target.matches('.fa.fa-ellipsis-v')) {
        allDropdowns.forEach(dropdown => {
          if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
          }
        });
      }
    };
  }

  redirectTo(path: any) {
    this.selectColor = this.selectedCustomerValue

    let url: any;
    if (path == 'add-customer') {
      this.selectedCustomerValue = null;
      this.selectColor = null;
      url = `/admin/customer/customer-manage/${this.selectedDealerId}/${path}`
    } else if (path == 'Delete') {
      this.selectColor = null;
      url = `/admin/customer/customer-manage`
      this.deletCustomer(this.selectedCustomerValue)
    } else if (path == 'alert-setting') {
      this.selectColor = null;
      url = `/admin/customer/customer-manage/${this.selectedCustomerValue.DealerId}/${this.selectedCustomerValue.Id}/${this.selectedCustomerValue?.User?.Id}/${path}`
    } else {
      url = `/admin/customer/customer-manage/${this.selectedCustomerValue.DealerId}/${this.selectedCustomerValue.Id}/${path}`;
    }

    this.router.navigateByUrl(url);
    this.refreshCustomerService.announceCustomerAdded();

  }

  deletCustomer(customer: any) {
    let url = this.CustomerManageService.deleteCustomer(this.selectedDealerId, customer?.Id)
    const initialState: ModalOptions = {
      initialState: {
        title: customer?.CustomerName,
        content: 'Are you sure you want to delete?',
        primaryActionLabel: 'Delete',
        secondaryActionLabel: 'Cancel',
        service: url
      },
    };
    this.bsModelRef = this.bsmodelService.show(
      DeleteConfirmationComponent,
      Object.assign(initialState, {
        id: "confirmation",
        class: "modal-md modal-dialog-centered",
      })
    );

    this.bsModelRef?.content.mapdata.subscribe(
      (value: any) => {
        if (value?.body?.ResponseMessage == 'Success') {
          this.refreshCustomerService.announceCustomerAdded();
          this.notificationService.showSuccess(value?.body?.Result?.Data)
        } else {
          this.notificationService.showError(value?.error.Error?.Message)
        }
      }
    );
  }

  onContextMenu(event: MouseEvent, item: any, i: any): void {
    this.selectedCustomerValue = item;
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

}
