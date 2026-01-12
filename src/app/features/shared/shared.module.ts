import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { SidebarModule } from "@solidexpert/ng-sidebar";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgSelectModule } from "@ng-select/ng-select";
import { TabsModule } from "ngx-bootstrap/tabs";
import { AlertModule } from "ngx-bootstrap/alert";
import { CarouselComponent, CarouselModule } from "ngx-owl-carousel-o";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TableModule } from "ngx-easy-table";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { NgxNavbarModule } from "ngx-bootstrap-navbar";
import { RouterModule } from "@angular/router";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PopoverModule } from "ngx-bootstrap/popover";
import { NgxPaginationModule } from "ngx-pagination";
import { NgxSpinnerModule } from "ngx-spinner";
import { SiteHeaderComponent } from "./layouts/components/site-header/site-header.component";
import { SiteFooterComponent } from "./layouts/components/site-footer/site-footer.component";
import { SkyLogoComponent } from "./components/sky-logo/sky-logo.component";
import { MainLayoutComponent } from './layouts/main-layout/main-layout/main-layout.component';
import { SkyBrowserAlertComponent } from './components/sky-browser-alert/sky-browser-alert.component';
import { SkyHomeSearchComponent } from './components/sky-home-search/sky-home-search.component';
import { SkySearchControlComponent } from './components/sky-search-control/sky-search-control.component';
import { DashboardFeaturesComponent } from './components/dashboard-features/dashboard-features.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './user/login/login.component';
import { DepoListComponent } from './components/depo-list/depo-list.component';
import { CompanyRoutingModule } from "./company/company-routing.module";
import { SkyBreadcrumbComponent } from './components/sky-breadcrumb/sky-breadcrumb.component';
import { CompanyModule } from "./company/company.module";
import { SkyCustomCheckboxComponent } from './components/form-control-components/sky-custom-checkbox/sky-custom-checkbox.component';
import { SkyCustomRadioComponent } from './components/form-control-components/sky-custom-radio/sky-custom-radio.component';
import { SkyRadioButtonComponent } from './components/form-control-components/sky-radio-button/sky-radio-button.component';
import { SkySwitchButtonComponent } from './components/form-control-components/sky-switch-button/sky-switch-button.component';
import { CommentModalComponent } from './components/comment-modal/comment-modal.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SwitchTabModalComponent } from './components/switch-tab-modal/switch-tab-modal.component';
import { TableViewComponent } from './components/form-control-components/table-view/table-view.component';
import { AlertComponent } from "./components/alert/alert.component";
import { SiteSidenavComponent } from './layouts/components/site-sidenav/site-sidenav.component';
import { ToastrModule } from "ngx-toastr";
import Swiper from "swiper";
import { SearchFilterPipe } from "./pipes/search-filter.pipe";
import { AgmCoreModule } from "@agm/core";
import { ClickOutsideDirective } from "./directives/click-outside.directive";
import { SiteSidebarComponent } from './layouts/admin/site-sidebar/site-sidebar.component';
import { AdminMainLayoutComponent } from './layouts/admin-main-layout/admin-main-layout.component';
import { AdminHeaderComponent } from './layouts/admin/admin-header/admin-header.component';
import { AdminSidebarComponent } from './layouts/admin/admin-sidebar/admin-sidebar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HistorySliderControlComponent } from './layouts/components/history-slider-control/history-slider-control.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { SearchInfoComponent } from './components/search-info/search-info.component';
import { CloseRoutesComponent } from './components/close-routes/close-routes.component';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav'
import { ClipboardModule } from 'ngx-clipboard';
import { MoveComponent } from './components/move/move.component';
import { DetailComponent } from './components/detail/detail.component';
import { SellComponent } from './components/sell/sell.component';
import { RechargeComponent } from './components/recharge/recharge.component';
import { CommandComponent } from './components/command/command.component';
import { IOSettingsComponent } from './components/io-settings/io-settings.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { ModifiedPasswordComponent } from './components/modified-password/modified-password.component';
import { UserDetailsComponent } from './components/shared-user/user-details/user-details.component';
import { UserSaleComponent } from './components/shared-user/user-sale/user-sale.component';
import { AddUserComponent } from './components/shared-user/add-user/add-user.component';
import { MoveAccountComponent } from './components/shared-user/move-account/move-account.component';
import { AddDeviceComponent } from './components/shared-user/add-device/add-device.component';
import { MoveDeviceComponent } from './components/shared-user/move-device/move-device.component';
import { UserDeviceListComponent } from './components/shared-user/user-device-list/user-device-list.component'
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { FilterAlertsPipe } from "./pipes/filterAlerts";
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { OpenTrackingComponent } from './user/open-tracking/open-tracking.component';
import { LogoutConfirmationDialogeComponent } from './components/logout-confirmation-dialoge/logout-confirmation-dialoge.component';
import { LocationInMapComponent } from './components/location-in-map/location-in-map.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
@NgModule({
  declarations: [
    SkyLogoComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    MainLayoutComponent,
    SkyBrowserAlertComponent,
    SkyHomeSearchComponent,
    SkySearchControlComponent,
    DashboardFeaturesComponent,
    HomePageComponent,
    LoginComponent,
    DepoListComponent,
    SkyBreadcrumbComponent,
    SkyCustomCheckboxComponent,
    SkyCustomRadioComponent,
    SkyRadioButtonComponent,
    SkySwitchButtonComponent,
    CommentModalComponent,
    ConfirmationDialogComponent,
    ErrorModalComponent,
    LoaderComponent,
    SwitchTabModalComponent,
    TableViewComponent,
    AlertComponent,
    SiteSidenavComponent,
    SearchFilterPipe,
    FilterAlertsPipe,
    ClickOutsideDirective,
    SiteSidebarComponent,
    AdminMainLayoutComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    HistorySliderControlComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    DeleteConfirmationComponent,
    SearchInfoComponent,
    CloseRoutesComponent,
    MoveComponent,
    DetailComponent,
    SellComponent,
    RechargeComponent,
    CommandComponent,
    IOSettingsComponent,
    CreateAccountComponent,
    ModifiedPasswordComponent,
    UserDetailsComponent,
    UserSaleComponent,
    AddUserComponent,
    MoveAccountComponent,
    AddDeviceComponent,
    MoveDeviceComponent,
    UserDeviceListComponent,
    ForgotPasswordComponent,
    OpenTrackingComponent,
    LogoutConfirmationDialogeComponent,
    LocationInMapComponent,
    PageNotFoundComponent


  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    SidebarModule,
    FontAwesomeModule,
    NgSelectModule,
    TabsModule.forRoot(),
    AlertModule.forRoot(),
    CarouselModule,
    BsDatepickerModule.forRoot(),
    TableModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxNavbarModule,
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    NgxPaginationModule,
    NgxSpinnerModule,
    ClipboardModule,
    ToastrModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCWvUzk2vVzV_jpGBAV4AxwvyMn47O3ekQ',
    }),

    TabsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [

    SidebarModule,
    FontAwesomeModule,
    NgSelectModule,
    TabsModule,
    AlertModule,
    CarouselModule,
    BsDatepickerModule,
    TableModule,
    ModalModule,
    BsDropdownModule,
    NgxNavbarModule,
    CollapseModule,
    PaginationModule,
    TooltipModule,
    PopoverModule,
    AccordionModule,
    SkyLogoComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    SkyBrowserAlertComponent,
    SkyHomeSearchComponent,
    SkySearchControlComponent,
    DashboardFeaturesComponent,
    LoginComponent,
    DepoListComponent, CompanyRoutingModule,
    SkyBreadcrumbComponent,
    LoaderComponent,
    SkyCustomCheckboxComponent,
    TableViewComponent,
    AlertComponent,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    SearchFilterPipe,
    FilterAlertsPipe,
    AgmCoreModule,
    MatAutocompleteModule,
    HistorySliderControlComponent,
    CloseRoutesComponent,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    LocationInMapComponent
  ],

  providers: [DatePipe]
})
export class SharedModule { }
