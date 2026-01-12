import { Component, Input } from '@angular/core';
import { SharedUserService } from '../shared-user/services/shared-user.service';
import { SharedSearchService } from '../../shared-service/shared.service';

@Component({
  selector: 'search-info',
  templateUrl: './search-info.component.html',
  styleUrls: ['./search-info.component.scss']
})
export class SearchInfoComponent {
  @Input() searchDefaultValue: string = '';

  columns: any;
  searchKeyword: any = '';
  openCloseNave: boolean = false
  openUserNave: boolean = false
  showContent: boolean = false
  showUserContent: boolean = false
  spinnerLoading: boolean = false
  tableLoading: boolean = false
  userTableLoading: boolean = false
  navigation: Array<any> = [
    {
      name: 'Detail',

    },
    {
      name: 'Sell',

    },
    {
      name: 'Move',

    },
    {
      name: 'Recharge',
    },
    // {
    //   name: 'Command',
    // },
    // {
    //   name: 'I/O Settings',
    // },
    {
      name: 'Create Account',
    },
    {
      name: 'Modified Password',
    },

  ]

  userNavigation: Array<any> = [
    {
      name: 'Detail',

    },
    {
      name: 'Sale',

    },
    {
      name: 'Add user',

    },
    {
      name: 'Move Account',
    },
    {
      name: 'Add Device',
    },
    {
      name: 'Move Device',
    },
    {
      name: 'Device List',
    },

  ]
  selectedNavItem: string | null = null;
  deviceListById: any;
  selectedData: any;
  userColumns: any
  userListById: any;
  selectColour: any;

  constructor(
    private sharedService: SharedSearchService,
    private sharedUserService: SharedUserService
  ) {
  }
  ngOnInit() {
    this.setInitialValue();

  }

  receivedClosePage(event: any) {
    this.openCloseNave = event
    this.openUserNave = event
  }

  toggoleButton(value: any) {    
    this.selectColour = value
    this.selectedData = value
    this.selectNavItem('Detail')
    this.openCloseNave = true
  }

  userDetail(value: any) {
    this.selectColour = value
    this.selectedData = value
    this.selectNavItem('Detail')
    this.openUserNave = true
  }

  device() {
    this.tableLoading = true;
    this.showContent = true
    this.showUserContent = false
    this.openCloseNave = false
    this.openUserNave = false
    this.sharedService.devicelistById(this.searchDefaultValue).subscribe((res: any) => {
      this.deviceListById = res?.body?.Result?.Data
      this.tableLoading = false;
    })
  }

  getUser() {
    this.showContent = false
    this.userTableLoading = true;
    this.showUserContent = true
    this.openUserNave = false
    this.openCloseNave = false
    this.sharedUserService.getUserbyId(this.searchDefaultValue).subscribe((res: any) => {
      this.userListById = res?.body?.Result?.Data
      this.userTableLoading = false;
    })
  }

  setData(searchKeyword: any) {
  }
  loading = false;
  selectNavItem(navItem: string) {
    this.loading = true;
    setTimeout(() => {
      this.selectedNavItem = navItem;
      this.loading = false;
    }, 1000);
  }
  isNavItemSelected(navItem: string): boolean {
    return this.selectedNavItem === navItem;
  }



  ngOnChanges() {
  }


  setInitialValue() {
    this.columns = [
      { key: 'Dealer', title: 'Dealer' },
      { key: 'Customer', title: 'Customer' },
      { key: 'Login Id', title: 'Login Id' },
      { key: 'Installed On', title: 'Installed On' },
      { key: 'Vehicle No.', title: 'Vehicle No.' },
      { key: 'Sim Phone No.', title: 'Sim Phone No.' },
      { key: 'IMEI', title: 'IMEI' },
      { key: 'Action', title: 'Action' },
    ]

    this.userColumns = [
      { key: 'Dealer', title: 'Dealer' },
      { key: 'Customer', title: 'Customer' },
      { key: 'Installed On', title: 'Login Id' },
      { key: 'Vehicle No.', title: 'Password' },
      { key: 'Sim Phone No.', title: 'Mobile' },
      { key: 'IMEI', title: 'Email' },
      { key: 'Action', title: 'Action' },
    ]
  }
}
