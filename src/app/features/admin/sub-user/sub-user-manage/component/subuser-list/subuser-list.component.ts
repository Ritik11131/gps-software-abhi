import { Component, ViewChild } from '@angular/core';
import { SubUserService } from '../../services/sub-user.service';
import { Router } from '@angular/router';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DeleteConfirmationComponent } from 'src/app/features/shared/components/delete-confirmation/delete-confirmation.component';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { RefreshpageService } from 'src/app/features/http-services/refreshpage.service';

@Component({
  selector: 'subuser-list',
  templateUrl: './subuser-list.component.html',
  styleUrls: ['./subuser-list.component.scss']
})
export class SubuserListComponent {
  selectedDealerId: any;
  selectedCustomerId: any;
  spinnerLoading: boolean = false
  subUserData: any;
  columns: any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [25, 50, 100];
  urlPath = [
    {
      path: 'modify-subuser',
      name: 'Modify'
    },
    {
      path: 'device-mapping',
      name: 'vehicle'
    },
    // {
    //   name: 'Delete Customer',
    //   path: 'Delete',
    // },
  ];
  bsModelRef!: BsModalRef;
  contextMenuPosition = { x: '0px', y: '0px' };

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger | any;
  selectedSubUserValue: any;
  selectColor: any;

  constructor(
    private subUserService: SubUserService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService,
    private bsmodelService: BsModalService,
    private notificationService: NotificationService,
    private refreshpage: RefreshpageService
  ) { }

  ngOnInit() {
    this.refreshpage.checkAndRedirect('/admin/subuser/customer-sub-user');  

    this.setInitialValue();
    this.refreshCustomerService.customerAdded$.subscribe(() => {
      this.getUserList()
    });
  }

  setInitialValue() {
    this.columns = [
      { key: 'Company', title: 'Login Id' },
      { key: 'password', title: 'password' },
      { key: 'Mobile No', title: 'Mobile No' },
      { key: 'Creation Date', title: 'Creation Date' },
      { key: 'Status', title: 'Status' },
      { key: 'Action', title: 'Action' },
    ]
  }

  confirm(event: any) {
    this.selectedDealerId = event?.dealerId;
    this.selectedCustomerId = event?.customerId

    this.getUserList()
  }

  getUserList() {
    this.spinnerLoading = true
    this.subUserService.userList(this.selectedDealerId, this.selectedCustomerId).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200) {
        let data = res?.body?.Result?.Data
        this.subUserData = data?.filter((item: any) => item.Type == 2)
      } else {
        this.subUserData = []
      }
    })
  }

  /**
  * table data change
  * @param event 
  */
  onTableDataChange(event: any) {
    this.page = event;
  };

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
    let url: any;
    this.selectColor = this.selectedSubUserValue
    if (path == 'add-subuser') {
      this.selectedSubUserValue = null;
      this.selectColor = null;
      url = `/admin/subuser/customer-sub-user/${this.selectedDealerId}/${this.selectedCustomerId}/${path}`
    } else if (path == 'Delete') {
      url = `/admin/subuser/customer-sub-user`
      this.deletSubUser(this.selectedSubUserValue);
    } else {
      
      url = `/admin/subuser/customer-sub-user/${this.selectedDealerId}/${this.selectedSubUserValue.CustomerId}/${this.selectedSubUserValue.Id}/${path}`;
    }
    this.router.navigateByUrl(url);
     this.refreshCustomerService.announceCustomerAdded();
  }

  addSubUser(event: any) {
    this.selectedSubUserValue = null;
    this.selectColor = null;
    let url: any;
    if (event == 'add-subuser') {
      this.selectedSubUserValue = null;
      this.selectColor = null;
      url = `/admin/subuser/customer-sub-user/${this.selectedDealerId}/${this.selectedCustomerId}/${event}`
    }
    this.refreshCustomerService.announceCustomerAdded();
    this.router.navigateByUrl(url);
  }

  deletSubUser(subUser: any) {
    this.selectColor = null;
    let url = this.subUserService.deleteSubuser(this.selectedDealerId, this.selectedCustomerId, subUser?.Id)
    const initialState: ModalOptions = {
      initialState: {
        title: subUser?.LoginId,
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
    this.selectedSubUserValue = item;
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

}
