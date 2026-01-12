import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgxNavbarCollapseComponent,
  NgxNavbarDynamicExpandDirective,
} from 'ngx-bootstrap-navbar';
import { StorageService } from 'src/app/features/http-services/storage.service';

import { SidenavService } from '../../services/sidenav.service';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { menu, admin } from '../../../constant/menu/residential.config';
import { UserService } from '../../../user/services/user.service';
import { SessionService } from 'src/app/features/http-services/session.service';
import { LogoutConfirmationDialogeComponent } from '../../../components/logout-confirmation-dialoge/logout-confirmation-dialoge.component';

@Component({
  selector: 'xchange-sidenav',
  templateUrl: './site-sidenav.component.html',
  styleUrls: ['./site-sidenav.component.scss'],
})
export class SiteSidenavComponent implements OnInit {
  opennav: boolean = true;
  accountName: string | null = '';
  accountId: string | null = '';
  accountAddress: string | null = '';
  displayCustomerNumber: any;
  customerName: any;

  logo: string = '';
  isMobile: boolean | any;
  minimumHeight: any;
  innerHeight: number = window.innerHeight;
  zoomLevel: number = 100;
  notification: any;
  username: any;
  email: any;
  userType: any;
  loginUser: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const screenWidth = window.innerWidth;
    const realScreenWidth = window.screen.width;

    this.onResizeScreenHideMenuDropdown();
    this.isMobile = window.innerWidth < 1024;
    return this.isMobile;
  }

  @ViewChildren('collapse')
  ngxNavbarCollapses!: QueryList<NgxNavbarDynamicExpandDirective>;
  menuCurrentState!: boolean;
  menuConfig: Array<any> = []; //commercialMenuIsCSR;
  project: string = '';
  modalRef!: BsModalRef;

  constructor(
    private sessionService: SessionService,
    private r: Router,
    private sideNav: SidenavService,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private ar: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    private modalService: BsModalService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private userSevice: UserService,
    private indexedDB: StorageService
  ) {}

  ngOnInit(): void {
    {
      localStorage.getItem('usertType') === 'admin'
        ? (this.menuConfig = admin)
        : (this.menuConfig = menu);
    }
    this.loginUser = localStorage.getItem('userName');
  }

  ngAfterViewInit() {
    this.sideNav.currentState.subscribe((open) => {
      this.menuCurrentState = open;
      if (!open) {
        this.ngxNavbarCollapses.forEach((c: any) => {
          c.isCollapsed = true;
        });
        const buttonElements = document.getElementsByClassName('rotate90');
        for (let i = 0; i <= buttonElements.length; i++) {
          if (buttonElements[i] && buttonElements[i].classList)
            buttonElements[i].classList.remove('rotate90');
        }
      }
    });

    this.cd.detectChanges();
  }

  toggleMenu() {
    this.opennav = !this.opennav;
    const xsmall = document.querySelectorAll('.navbar-nav');
    xsmall.forEach((element) => {
      const elem = element as HTMLElement;
      elem.style.overflowY = 'unset';
    });
    if (this.menuCurrentState) {
      this.sideNav.hide();
      const submenu = document.querySelectorAll('.submenu-css');
      submenu.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.height = '70px';
      });
    } else {
      this.sideNav.show();
      const submenu = document.querySelectorAll('.submenu-css');
      submenu.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.height = 'unset';
      });
    }
    return true;
  }

  expandSideNav() {
    this.sideNav.show();
  }

  navigateToRoute(
    path: string,
    e: any,
    isExternal: boolean,
    level1: any = null,
    event: any
  ) {
    const xsmall = document.querySelectorAll('.navbar-nav');
    xsmall.forEach((element) => {
      const elem = element as HTMLElement;
      elem.style.overflowY = 'unset';
    });
    if (event == true) {
      this.opennav = true;
    } else {
      this.opennav = !this.opennav;
    }

    const navEle = e.target;
    localStorage.setItem('path', path);
    const subMenu = navEle.closest('.level1-li');
    subMenu.classList.remove('show-pop-menu');
    if (level1 !== null && level1?.name === 'Products') {
    }
    this.r.navigateByUrl('/' + path);
    subMenu.classList.remove('show-pop-menu');
    this.sideNav.hide();
    return true;
  }

  handleCollapse(level: string, index: number) {
    const collapseElement = this.document.getElementById(
      level + '-collapse-' + index
    );
    const btnElement = this.document.getElementById(level + '-btn-' + index);
    if (collapseElement?.classList.contains('collapsing')) {
      btnElement?.classList.toggle('rotate90');
    }
    this.ngxNavbarCollapses.forEach((c: any) => {
      if (
        c.nativeElement.id !== level + '-collapse-' + index &&
        c.nativeElement?.id?.includes(level)
      ) {
        c.isCollapsed = true;
      }
    });
    const collapseBtnList = document.querySelectorAll(
      "[id^='" + level + "-btn-']"
    );
    collapseBtnList.forEach((btn: any) => {
      if (btn.id !== level + '-btn-' + index) {
        btn.classList.remove('rotate90');
      }
    });
    return true;
  }
  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
    }
  }
  showTooltip = false;

  onShowMenu(e: any, name: any) {
    this.showTooltip = false;
    const showPopup = this.document.querySelector('.show-pop-menu');
    showPopup?.classList.remove('show-pop-menu');
    const navItem = e.target.closest('.level1-li');
    navItem.classList.toggle('show-pop-menu');
    const xsmall = document.querySelectorAll('.sub-menu');

    if (name == 'Reports') {
      if (window.screen.width > 1024) {
        xsmall.forEach((element) => {
          const elem = element as HTMLElement;
          elem.style.top = '-147px';
        });
        //  elem.scrollIntoView(scrollOptions);
      }
    } else {
      xsmall.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.top = '0px';
      });
    }
    return true;
  }

  onClickedOutsideOfMenu(name: string, i: number) {
    const navItem = this.document.querySelector('.' + name + i);
    navItem?.classList.remove('show-pop-menu');

    // if (navItem && navItem.classList) {
    //   navItem.classList.remove("show-pop-menu");
    // }
  }

  onResizeScreenHideMenuDropdown() {
    const showPopup = this.document.querySelector('.show-pop-menu');
    showPopup?.classList.remove('show-pop-menu');
  }

  navigateToUserSearch() {
    const baseUrlPath = this.router.url.split('?')[0].includes('commercial')
      ? 'commercial'
      : 'residential';
    this.storageService.clear();
    // this.userService.setAccountInfoState(false);
    this.sideNav.hide();
    this.r.navigate(['/' + baseUrlPath + '/account/search']);
    // return true;
    // this.r.navigate(["/residential/account/search"]);
  }
  ngOnDestroy() {}

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
        id: 'side-nav-confirmation',
        class: 'modal-md modal-dialog-centered',
      })
    );
  }
  getmenu() {
    this.userSevice.getMenuList().subscribe((res: any) => {
    });
  }
  logout() {
    if (this.loginUser === 'admin') {
      localStorage.clear();
      sessionStorage.clear();
      this.indexedDB.clear();
      window.location.href = 'login';
      this.router.navigateByUrl('');
    } else {
      const initialState: ModalOptions = {
        initialState: {
          title: this.loginUser ,
          Type:'Customer',
          content: 'Are you sure you want to Logout ?',
          primaryActionLabel: 'Ok',
          secondaryActionLabel: 'Cancel',
        },
      };
      this.modalRef = this.modalService.show(
        LogoutConfirmationDialogeComponent,
        Object.assign(initialState, {
          id: "confirmation",
          class: "modal-md modal-dialog-centered",
        })
      );
    }
  }

  onOpenProfile(e: any) {
    this.opennav = true;
    this.sideNav.hide();
    this.router.navigateByUrl('/user/profile/user');
  }

  changeMenuCss() {
    if (!this.opennav) {
      const xsmall = document.querySelectorAll('.navbar-nav');
      xsmall.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.overflowY = 'auto';
      });
    }
  }
}
