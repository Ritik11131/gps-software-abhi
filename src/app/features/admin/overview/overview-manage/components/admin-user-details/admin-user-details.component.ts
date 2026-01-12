import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { AdminProfileService } from 'src/app/features/admin/profile/profile-manage/services/admin-profile.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { ChangePasswordComponent } from 'src/app/features/shared/components/change-password/change-password.component';
import { EditProfileComponent } from 'src/app/features/shared/components/edit-profile/edit-profile.component';
import { OverviewService } from '../../services/overview.service';
import { AllCustomerDetailsComponent } from 'src/app/features/admin/dashboard/dashboard-manage/component/all-customer-details/all-customer-details.component';
import { AllCustomerDetailOverviewComponent } from '../all-customer-detail-overview/all-customer-detail-overview.component';

@Component({
  selector: 'admin-user-details',
  templateUrl: './admin-user-details.component.html',
  styleUrls: ['./admin-user-details.component.scss']
})
export class AdminUserDetailsComponent {
  dealerData: any;
  selectedDealer: any;
  customerData: any;
  activeCustomersLength: any;
  bsModalRef!: BsModalRef
  balancePointCount: any;
  newPointCount: any;
  renewalPointCount: any;
  isAdmin: any;
  accountInfo: any;
  DeviceList: any;
  userDetail: any;
  totalRechargeCount: any;
  totalActivateCount: any;
  totalmodifiedrechargeCount: any;
  expiredSoon: any;

  constructor(
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private router: Router,
    private modalService: BsModalService,
    private adminProfileService: AdminProfileService,
    private storageService: StorageService,
    private overViewservice: OverviewService
  ) { }
  
  ngOnInit() {
    this.getDealerlist()
    this.getUserDetail();
    this.getBalancePoint();
  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;

    })
  }
  getUserDetail() {
    this.storageService.getItem("userDetail").subscribe((res) => {
      this.accountInfo = res;
      this.getDeviceDetail(this.accountInfo)

    });
  }

  onRedirectCustomer() {
    if (this.accountInfo.role == 1) {
      this.router.navigateByUrl('admin/reseller-raster')
    }
    else {
      this.router.navigateByUrl('admin/customer/customer-manage')
    }
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

  onOpenChangePassword() {
    const initialState: ModalOptions = {
      initialState: {},
    };
    this.bsModalRef = this.modalService.show(
      ChangePasswordComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }

  getBalancePoint() {
    this.adminProfileService.balancePointCount().subscribe((res: any) => {
      this.balancePointCount = res?.body?.Result?.Data         
      this.balancePointCount?.forEach((val: any) => {
        if (val?.PointName == 'New points') {
          this.newPointCount = val?.Count
        } else if (val?.PointName == 'Recharge Points') {
          this.renewalPointCount = val?.Count
        }
      })
    })
  }

  getDeviceDetail(profileDetail: any) {
    this.overViewservice.getDeviceCount(profileDetail?.dealerId,profileDetail?.role).subscribe((res: any) => {
      this.DeviceList = res?.body?.Result?.Data;
      this.totalRechargeCount = this.DeviceList.filter((val: any) => val?.PointValidity?.CurrentPointType === 1).length;
      this.totalActivateCount = this.DeviceList.filter((val: any) => val?.PointValidity?.CurrentPointType === 0).length;
      this.totalmodifiedrechargeCount = this.DeviceList.filter((val: any) => val?.PointValidity?.CurrentPointType === 2).length;
      this.expiredSoon = this.DeviceList.filter((val: any) => {
        if (val?.PointValidity?.NextRechargeDue) {
          const dateToCheck: any = new Date(val?.PointValidity?.NextRechargeDue);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return dateToCheck <= sevenDaysAgo;
        } else {
          return false;
        }
      });
    });
  }

  openAllresellerDetails() {
    const initialState: ModalOptions = {
      initialState: {
        selectDealer: 0,
        dealerName: ' All Device ',
        selectedType:'Overview'
      },
    };
    this.bsModalRef = this.modalService.show(
      AllCustomerDetailOverviewComponent,
      Object.assign(initialState, {
        id: "confirmation",
        class: "modal-xl modal-dialog-centered",
      })
    );
  }
}
