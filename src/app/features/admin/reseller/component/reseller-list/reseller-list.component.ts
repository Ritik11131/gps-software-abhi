import { Component, ViewChild } from '@angular/core';
import { ResellerService } from '../../service/reseller.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { RefreshpageService } from 'src/app/features/http-services/refreshpage.service';

@Component({
  selector: 'reseller-list',
  templateUrl: './reseller-list.component.html',
  styleUrls: ['./reseller-list.component.scss']
})
export class ResellerListComponent {
  resellerList: any;
  columns: any;
  searchKeyword: any;
  selectedRow: number | null = null;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20, 50, 100];
  spinnerLoading:boolean =false
  urlPath = [
    {path: 'modify-reseller',name: 'Modify Reseller' },
    {path: 'Point-Management',name: 'Points Manangement' },
    {path: 'add-employee',name: 'Add Employee' },
    // {path: 'recharge', name : 'Recharge'}
  ]
  selectedDealerId: any;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger | any;
  contextMenuPosition = { x: '0px', y: '0px' };
  selectedResellerValue: any;
  selectedColor: any;
  constructor(
    private resellerService: ResellerService,
    private refreshCustomerService: RefreshCustomerService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private refreshpage: RefreshpageService
  ) { }

  ngOnInit() {
    this.refreshpage.checkAndRedirect('/admin/reseller-raster');  

    this.refreshCustomerService.customerAdded$.subscribe(() => {      
      this.getResellerList();
    });
    this.setInitialTable()
    this.getResellerList();
  }

  setInitialTable() {
    this.columns = [
      { key: 'Company', title: 'Company' },
      { key: 'Name', title: 'Reseller Name' },
      { key: 'Name', title: 'Login Id' },
      { key: 'Mobile No', title: 'Mobile No' },
      { key: 'New Points', title: 'New Points' },
      { key: 'Renew Points', title: 'Renew Points' },
      { key: 'Action', title: 'Action' },
    ]

  }

  getResellerList() {
    this.spinnerLoading = true
    this.resellerService.resellerData().subscribe((res: any) => {
      this.resellerList = res?.body?.Result?.Data
      this.spinnerLoading = false

    });
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


  onTableDataChange(event:any) {
    this.page = event;
  }

 
  redirectTo(path: any) {
    let url: any;   
    this.selectedColor = this.selectedResellerValue 
     
    if(path == 'add-reseller') {
     this.selectedResellerValue = null;
     this.selectedColor = null;
      url = `/admin/reseller-raster/add-reseller`
    }  else if(path == 'modify-reseller') {
      url = `/admin/reseller-raster/${this.selectedResellerValue.Id}/modify-reseller`;
      this.refreshCustomerService.announceCustomerAdded();
    }
    else if(path == 'recharge') {
      url = `/admin/reseller-raster/${this.selectedResellerValue.Id}/recharge`;
    }else if(path == 'add-employee'){
      url = `/admin/reseller-raster/${this.selectedResellerValue.Id}/add-employee`;
    }else {
      url = `/admin/reseller-raster/${this.selectedResellerValue.Id}/Point-Management`;
      this.refreshCustomerService.announceCustomerAdded();
    }
    this.router.navigateByUrl(url);
    
  }

  onContextMenu(event: MouseEvent, item: any, i: any): void {    
    this.selectedResellerValue = item;   

    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

}