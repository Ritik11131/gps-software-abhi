import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SidenavService } from '../services/sidenav.service';
import { Subscription, filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { MenuConfigService } from '../services/menu-config.service';
import { menuType } from '../../constant/menu/menu.type';
import { TabsService } from 'src/app/features/http-services/tabs.service';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LogoutConfirmationDialogeComponent } from '../../components/logout-confirmation-dialoge/logout-confirmation-dialoge.component';
@Component({
  selector: 'app-admin-main-layout',
  templateUrl: './admin-main-layout.component.html',
  styleUrls: ['./admin-main-layout.component.scss']
})
export class AdminMainLayoutComponent {
  _opened: boolean = true;
  @ViewChild("appHeader") appHeader!: ElementRef;
  height: number = 0;

  menuType!: string;
  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;
  @ViewChild("sidebarContent") sidebarContentRef: ElementRef | any;
  @ViewChild("sidebar") sidebar: ElementRef | any;

  sidenavConfig: any = {
    dock: false,
    mode: "push",
    sidebarClass: "main-side-nav",
    showBackdrop: true,
    dockedSize: "0",
    backdropClass: "main-side-nav-backdrop",
    closeOnClickBackdrop: true,
  };

  hideSideBar = false;
  isMashupSub!: Subscription;
  accountInfoSetSub!: Subscription;
  isShipToUserSub!: Subscription;
  sliderOptionsForCustomerMsg: OwlOptions = {
    loop: false,
    navText: ["", ""],
    autoWidth: true,
    autoHeight: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 2,
      },
      940: { items: 3 },
    },
    nav: false,
    margin: 15,
  };
  isCustomer: boolean = false;
  showCustomerMessages: boolean = true;
  bsModalRef!: BsModalRef;
  salePersonNotifications: any = [];
  userType: any;
  tabs: any;
  tabsSubject: any;
  currentUrl: any;
  loginUser: unknown;

  constructor(
    private sideNav: SidenavService,
    private cd: ChangeDetectorRef,
    private menuConfig: MenuConfigService,
    public router: Router,
    private elRef: ElementRef,
    private renderer: Renderer2,
    public tabService : TabsService,
    public storageService : StorageService,
    private location : Location,
    private modalService : BsModalService
  ) {
    document.body.classList.add("add-scroll");
    this.hideSideBar = false;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
      // Store current URL in localStorage
    });
  }

  @HostListener("window:scroll", ["$event"])
  doSomething(event: any) {
    // console.debug("Scroll Event", document.body.scrollTop);
    // see András Szepesházi's comment below
    // console.debug("Scroll Event", window.pageYOffset);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.screenHeight = window.innerHeight;
    this.updateConfig(this.screenWidth);
    this.calculateMinHeight(this.appHeader.nativeElement);
  }

  ngOnInit(): void {
    this.loginUser = localStorage.getItem('userName');

     this.tabService.tabs$.subscribe(tabs => {
      this.tabs = tabs;
    })
    this.userType = localStorage.getItem("userType")
    const scrollerElement = document.getElementsByClassName(
      "ng-sidebar__content"
    )[0];
    if (scrollerElement) {
      this.renderer.setStyle(scrollerElement, "overflow", "hidden");
    }
    this.updateConfig(window.innerWidth);
  



    let showNotifications = localStorage.getItem("showSalesNotification");
    if (showNotifications == "false") {
      this.showCustomerMessages = false;
    }
   
  }


  ngAfterViewInit() {
    this.calculateMinHeight(this.appHeader.nativeElement);
    this.menuConfig.currentState.subscribe((_menuType) => {
      this.menuType = _menuType;
      this.sidenavConfig["dock"] =
        this.menuType === menuType.sideNav && this.screenWidth > 993
          ? true
          : false;
      this.sidenavConfig["dockedSize"] =
        this.menuType === menuType.sideNav ? "80px" : "0px";
    });
    this.sideNav.currentState.subscribe((open) => (this._opened = open));
    this.cd.detectChanges();
  }

  updateConfig(screenWidth: number) {
    if (screenWidth <= 993) {
      this.sidenavConfig.dock = false;
    } else {
      this.sidenavConfig.dock = true;
    }
  }

  // ngOnDestroy(): void {
  //   this.isMashupSub.unsubscribe();
  // }

  hideSidebar() {
    this.sideNav.hide();
  }

  toggleSidebar() {
    this._opened = !this._opened;
  }

  calculateMinHeight(el: HTMLElement): void {
    const minHeight: any = this.screenHeight - el.offsetHeight;
    localStorage.setItem("minHeight", minHeight);
    return minHeight;
    // localStorage.setItem("minHeight", minHeight);
    // container.style.minHeight = `${minHeight}px`;
  }
  ngAfterViewChecked(): void {
    if (this.appHeader.nativeElement.offsetHeight !== this.height) {
      this.height = this.appHeader.nativeElement.offsetHeight;
      // this.menuConfig.headerOffSetHeight.next(this.height);
    }
  }
  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
  closeSidebar(event: any) {
    this._opened = false;
  }

  hideCustomerMsg() {
    this.showCustomerMessages = false;
    localStorage.setItem("showSalesNotification", "false");
  }

  onDismissAlert(dismissedAlert: any) {
    this.salePersonNotifications = this.salePersonNotifications.filter(
      (message: any) => message !== dismissedAlert
    );
  }


  activeIndex: number = 0;

setActive(index: number) {
  const currentTabs = this.tabsSubject.getValue() || [];
  const newTabs = currentTabs.map((tab: any, i: number) => ({ ...tab, active: i === index }));
  this.tabsSubject.next(newTabs);
  this.storageService.setItems('tabs', JSON.stringify(newTabs));
}
routetopage(path : any){
  this.router.navigateByUrl(path)
}

logout(){
    // this.sessionService.logout();
    const initialState: ModalOptions = {
      initialState: {
        title: this.loginUser ,
        Type:'Customer',
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

}
