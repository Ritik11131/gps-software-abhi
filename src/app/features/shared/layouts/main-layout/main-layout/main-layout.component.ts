import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SidenavService } from '../../services/sidenav.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { MenuConfigService } from '../../services/menu-config.service';
import { menuType } from '../../../constant/menu/menu.type';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent 
implements OnInit, AfterContentChecked, AfterViewChecked{
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

  customerMessageAlerts = [
    {
      msg: "Valued customer - latest news on Coronavirus.",
      src: "/assets/icons/feather-alert-octagon.svg",
    },
    {
      msg: "The FSC (Fuel Surcharge) for this week is 55%",
      src: "/assets/icons/awesome-gas-pump.svg",
    },
    {
      msg: "For quick order status updates, text your Mohawk Order Reference or Purchase Order Number to (520)-277-9937 to  receive brief, up-to-date order status information.",
      src: "/assets/icons/zocial-call.svg",
    },
    {
      msg: "Truck tracking now available by clicking on Today’s Shipments.",
      src: "/assets/icons/awesome-truck.svg",
    },
    {
      msg: "Mohawk Residential import Freight Surcharge Revision Effective 10.3.22",
      src: "/assets/icons/awesome-box.svg",
    },
  ];

  salePersonNotifications: any = [];
  userType: any;

  constructor(
    private sideNav: SidenavService,
    private cd: ChangeDetectorRef,
    private menuConfig: MenuConfigService,
    public router: Router,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
    document.body.classList.add("add-scroll");
    this.hideSideBar = false;
  
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
}
