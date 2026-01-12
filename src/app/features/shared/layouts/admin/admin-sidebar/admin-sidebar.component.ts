import { DOCUMENT } from "@angular/common";
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
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgxNavbarCollapseComponent,
  NgxNavbarDynamicExpandDirective,
} from "ngx-bootstrap-navbar";
import { StorageService } from "src/app/features/http-services/storage.service";

import { SidenavService } from "../../services/sidenav.service";

import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ConfirmationDialogComponent } from "../../../components/confirmation-dialog/confirmation-dialog.component";
import { menu, admin } from "../../../constant/menu/residential.config";
import { UserService } from "../../../user/services/user.service";
import { SessionService } from "src/app/features/http-services/session.service";
import { TabsService } from "src/app/features/http-services/tabs.service";
import { ChangePasswordComponent } from "../../../components/change-password/change-password.component";
import { EditProfileComponent } from "../../../components/edit-profile/edit-profile.component";
import { LogoutConfirmationDialogeComponent } from "../../../components/logout-confirmation-dialoge/logout-confirmation-dialoge.component";
@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {
  opennav: boolean = true
  accountName: string | null = "";
  accountId: string | null = "";
  accountAddress: string | null = "";
  displayCustomerNumber: any;
  customerName: any;
  bsModalRef!: BsModalRef
  logo: string = "";
  isMobile: boolean | any;
  minimumHeight: any;
  innerHeight: number = window.innerHeight;
  zoomLevel: number = 100;
  notification: any;
  username: any;
  email: any;
  userType: any;
  loginUser: any;
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    const screenWidth = window.innerWidth;
    const realScreenWidth = window.screen.width;

    this.onResizeScreenHideMenuDropdown();
    this.isMobile = window.innerWidth < 1024;
    return this.isMobile;
  }

  @ViewChildren("collapse")
  ngxNavbarCollapses!: QueryList<NgxNavbarDynamicExpandDirective>;
  menuCurrentState!: boolean;
  menuConfig: Array<any> = []; //commercialMenuIsCSR;
  project: string = "";
  modalRef!: BsModalRef;

  constructor(
    public sessionService: SessionService,
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
    private tabsetService: TabsService,
  ) { }

  ngOnInit(): void {
    { localStorage.getItem('usertType') === 'admin' ? this.menuConfig = admin : this.menuConfig = menu }
    this.loginUser = localStorage.getItem('userName');
    this.onCheckRole()
  }

  onCheckRole() {
    this.storageService.getItem("userDetail").subscribe((user: any) => {
      if (user.role === "1") {
        this.menuConfig = admin;
      } else if (user.role === "2") {
        this.menuConfig = admin.filter(item => item.name !== "Reseller");
      }
    })
  }

  ngAfterViewInit() {
    this.sideNav.currentState.subscribe((open) => {
      this.menuCurrentState = open;
      if (!open) {
        this.ngxNavbarCollapses.forEach((c: any) => {
          c.isCollapsed = true;
        });
        const buttonElements = document.getElementsByClassName("rotate90");
        for (let i = 0; i <= buttonElements.length; i++) {
          if (buttonElements[i] && buttonElements[i].classList)
            buttonElements[i].classList.remove("rotate90");
        }
      }
    });

    this.cd.detectChanges();
  }

  onOpenChangePassword() {
    const initialState: ModalOptions = {
      initialState: {},
    };
    this.bsModalRef = this.modalService.show(
      ChangePasswordComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

  onOpenEditProfile() {
    const initialState: ModalOptions = {
      initialState: {},
    };
    this.bsModalRef = this.modalService.show(
      EditProfileComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

  toggleMenu() {
    this.opennav = !this.opennav;
    const xsmall = document.querySelectorAll(".navbar-nav");
    if(this.opennav) {
      xsmall.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.overflowX = 'unset'
      });
    } else {
      xsmall.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.overflowX = 'auto'
      });
    }
    if (this.menuCurrentState) {
      this.sideNav.hide();

    } else {      
      this.sideNav.show();
    }
    return true;
  }

  expandSideNav() {
    this.sideNav.show();
  }

  navigateToRoute(    
    path: any,
    e: any,
    isExternal: boolean,
    level1: any = null,
    event: any
  ) {
      const xsmall = document.querySelectorAll(".navbar-nav");

    if (event == true) {
      this.opennav = true;
    }
    else {
      this.opennav = !this.opennav;
    }

    if(this.opennav) {
      xsmall.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.overflowX = 'unset'
      });
    } else {
      xsmall.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.overflowX = 'auto'
      });
    }

    let tabsdata = {
      path: path,
      name: e.target.innerText
    }

    this.tabsetService.addTab(tabsdata);

    const navEle = e.target;
    localStorage.setItem("path", path);
    const subMenu = navEle.closest(".level1-li");
    subMenu.classList.remove("show-pop-menu");
    if (level1 !== null && level1?.name === "Products") {
    }
    this.r.navigateByUrl("/" + path);
    subMenu.classList.remove("show-pop-menu");
    this.sideNav.hide();
    return true;
  }

  handleCollapse(level: string, index: number) {
    const collapseElement = this.document.getElementById(
      level + "-collapse-" + index
    );
    const btnElement = this.document.getElementById(level + "-btn-" + index);
    if (collapseElement?.classList.contains("collapsing")) {
      btnElement?.classList.toggle("rotate90");
    }
    this.ngxNavbarCollapses.forEach((c: any) => {
      if (
        c.nativeElement.id !== level + "-collapse-" + index &&
        c.nativeElement?.id?.includes(level)
      ) {
        c.isCollapsed = true;
      }
    });
    const collapseBtnList = document.querySelectorAll(
      "[id^='" + level + "-btn-']"
    );
    collapseBtnList.forEach((btn: any) => {
      if (btn.id !== level + "-btn-" + index) {
        btn.classList.remove("rotate90");
      }
    });
    return true;
  }
  @HostListener("document:click", ["$event"])
  onClick(event: Event) {

    if (!this.elementRef.nativeElement.contains(event.target)) {

    }
  }
  showTooltip = false;
  onShowMenu(e: any, name: any) {

    this.showTooltip = false;
    const showPopup = this.document.querySelector(".show-pop-menu");
    showPopup?.classList.remove("show-pop-menu");
    const navItem = e.target.closest(".level1-li");
    navItem.classList.toggle("show-pop-menu");
    const xsmall = document.querySelectorAll('.sub-menu');
    
    if (name == 'Device') {
      if (window.screen.width > 1024) {
        xsmall.forEach((element) => {
          const elem = element as HTMLElement;
          elem.style.top = '-147px';
        });
        //  elem.scrollIntoView(scrollOptions);
      }
    } else if ( name == 'Sim Operator') {
      if (window.screen.width > 1024) {
        xsmall.forEach((element) => {
          const elem = element as HTMLElement;
          elem.style.top = '-110px';
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

    const navItem = this.document.querySelector("." + name + i);
    navItem?.classList.remove("show-pop-menu");

    // if (navItem && navItem.classList) {
    //   navItem.classList.remove("show-pop-menu");
    // }
  }

  onResizeScreenHideMenuDropdown() {
    const showPopup = this.document.querySelector(".show-pop-menu");
    showPopup?.classList.remove("show-pop-menu");
  }

  navigateToUserSearch() {
    const baseUrlPath = this.router.url.split("?")[0].includes("commercial")
      ? "commercial"
      : "residential";
    this.storageService.clear();
    // this.userService.setAccountInfoState(false);
    this.sideNav.hide();
    this.r.navigate(["/" + baseUrlPath + "/account/search"]);
    // return true;
    // this.r.navigate(["/residential/account/search"]);
  }
  ngOnDestroy() { }

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
        id: "side-nav-confirmation",
        class: "modal-md modal-dialog-centered",
      })
    );
  }
  getmenu() {
    this.userSevice.getMenuList().subscribe((res: any) => {
    })
  }
  // logout() {
  //   this.sessionService.logout();

  // }

  logout(){
    const initialState: ModalOptions = {
      initialState: {
        title: this.loginUser,
        content: 'Are you sure you want to Logout ?',
        primaryActionLabel: 'Ok',
        secondaryActionLabel: 'Cancel',
      },
    };
    this.bsModalRef = this.modalService.show(
      LogoutConfirmationDialogeComponent,
      Object.assign(initialState, {
        id: "confirmation",
        class: "modal-md modal-dialog-centered",
      })
    );
  }

  onOpenProfile() {
    this.opennav = true
    this.sideNav.hide();
    this.router.navigateByUrl('admin/admin-profile/profile-manage-user')
  }

  changeMenuCss(){
    const xsmall = document.querySelectorAll(".navbar-nav");
    if(this.opennav) {
      xsmall.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.overflowX = 'unset'
      });
    } else {
      xsmall.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.overflowX = 'auto'
      });
    }

    
  }
}
