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
      name: 'Update'
    },
    {
      path: 'device-mapping',
      name: 'vehicle'
    },
    {
      name: 'Delete',
      path: 'Delete',
    },
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
    // Call getUserList by default when page loads
    this.getUserList();
    
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

  // Commented out - no longer using filter dropdowns
  // confirm(event: any) {
  //   this.selectedDealerId = event?.dealerId;
  //   this.selectedCustomerId = event?.customerId

  //   this.getUserList()
  // }

  getUserList() {
    this.spinnerLoading = true
    // No need to pass dealerId and customerId since we're showing all users
    this.subUserService.userList(null, null).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status == 200 && res?.body?.result === true) {
        let data = res?.body?.data || []
        
        // Show all users with userType 1 (Dealer) or userType 2 (Customer)
        this.subUserData = data?.filter((item: any) => 
          item.userType === 1 || item.userType === 2
        );
        
        this.count = this.subUserData.length;
      } else {
        this.subUserData = []
        this.count = 0;
      }
    }, (error: any) => {
      this.spinnerLoading = false;
      this.subUserData = [];
      this.count = 0;
      console.error('Error fetching user list:', error);
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
      // Route requires :id/:cusID parameters, using 0 as default since filters are removed
      url = `/admin/subuser/customer-sub-user/0/0/${path}`
    } else if (path == 'Delete') {
      url = `/admin/subuser/customer-sub-user`
      this.deletSubUser(this.selectedSubUserValue);
      return; // Return early for delete, announceCustomerAdded is called in deletSubUser
    } else {
      // Use fkCustomerId and fkParentId from the selected user data
      const customerId = this.selectedSubUserValue?.fkCustomerId || 0;
      const dealerId = this.selectedSubUserValue?.fkParentId || 0;
      url = `/admin/subuser/customer-sub-user/${dealerId}/${customerId}/${this.selectedSubUserValue.id}/${path}`;
    }
    // Don't call announceCustomerAdded() when navigating - only call it after successful save/update
    this.router.navigateByUrl(url);
  }

  addSubUser(event: any) {
    this.selectedSubUserValue = null;
    this.selectColor = null;
    let url: any;
    if (event == 'add-subuser') {
      this.selectedSubUserValue = null;
      this.selectColor = null;
      // Route requires :id/:cusID parameters, using 0 as default since filters are removed
      url = `/admin/subuser/customer-sub-user/0/0/${event}`
    }
    // Don't call announceCustomerAdded() when navigating - only call it after successful save/update
    this.router.navigateByUrl(url);
  }

  deletSubUser(subUser: any) {
    this.selectColor = null;
    // Use new deleteUser API
    let deleteService = this.subUserService.deleteUser(subUser?.id);
    const initialState: ModalOptions = {
      initialState: {
        title: `Delete User: ${subUser?.loginId}`,
        content: 'Are you sure you want to delete this user? This action cannot be undone.',
        primaryActionLabel: 'Delete',
        secondaryActionLabel: 'Cancel',
        service: deleteService,
        confirmationType: 'delete' // Use DELETE typing confirmation
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
        // Delete API doesn't return a response body - if no error, show success
        if (value?.error) {
          // Error case - show error message
          const errorMsg = value?.error?.message || value?.error?.Error?.Message || 'Failed to delete user';
          this.notificationService.showError(errorMsg);
        } else {
          // Success - no response body, just show success message
          this.refreshCustomerService.announceCustomerAdded();
          this.notificationService.showSuccess('User deleted successfully');
        }
      },
      (error: any) => {
        // Handle subscription error
        const errorMsg = error?.error?.message || error?.message || 'Failed to delete user';
        this.notificationService.showError(errorMsg);
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
