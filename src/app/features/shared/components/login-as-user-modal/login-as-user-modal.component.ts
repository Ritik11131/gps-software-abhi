import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserSession, UserSwitchService } from '../../services/user-switch.service';
import { SharedUserService } from '../shared-user/services/shared-user.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'app-login-as-user-modal',
  templateUrl: './login-as-user-modal.component.html',
  styleUrls: ['./login-as-user-modal.component.scss']
})
export class LoginAsUserModalComponent implements OnInit {
  // Passed via modal initialState
  currentSession!: UserSession;
  nextRole!: 'dealer' | 'customer' | 'subuser';
  sessionDepth!: number;

  searchKeyword: string = '';
  searchResults: any[] = [];
  isSearching: boolean = false;
  isSwitching: boolean = false;
  hasSearched: boolean = false;
  selectedUser: any = null;

  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private userSwitchService: UserSwitchService,
    private sharedUserService: SharedUserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  get searchPlaceholder(): string {
    switch (this.nextRole) {
      case 'dealer': return 'Search dealer by login ID...';
      case 'customer': return 'Search customer by login ID...';
      case 'subuser': return 'Search sub-user by login ID...';
      default: return 'Search user by login ID...';
    }
  }

  get roleLabel(): string {
    return this.userSwitchService.getRoleLabel(this.nextRole);
  }

  get modalTitle(): string {
    return `Login As ${this.roleLabel}`;
  }

  searchUsers(): void {
    if (!this.searchKeyword || this.searchKeyword.trim().length < 1) {
      this.notificationService.showError('Please enter a search keyword');
      return;
    }

    this.isSearching = true;
    this.hasSearched = true;
    this.selectedUser = null;

    this.sharedUserService.getUserbyId(this.searchKeyword.trim()).subscribe(
      (res: any) => {
        this.isSearching = false;
        const data = res?.body?.data || res?.body?.Result?.Data || [];
        this.searchResults = Array.isArray(data) ? data : [data];
      },
      (error: any) => {
        this.isSearching = false;
        this.searchResults = [];
        this.notificationService.showError('Search failed. Please try again.');
      }
    );
  }

  onSearchKeypress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchUsers();
    }
  }

  selectUser(user: any): void {
    this.selectedUser = user;
  }

  loginAsSelected(): void {
    if (!this.selectedUser) {
      this.notificationService.showError('Please select a user first');
      return;
    }

    const loginId = this.selectedUser?.Customer?.User?.LoginId
      || this.selectedUser?.LoginId
      || this.selectedUser?.loginId
      || '';
    const password = this.selectedUser?.Customer?.User?.Password
      || this.selectedUser?.Password
      || this.selectedUser?.password
      || '';
    const displayName = this.selectedUser?.Customer?.CustomerName
      || this.selectedUser?.Dealer?.Name
      || this.selectedUser?.Name
      || this.selectedUser?.name
      || loginId;

    if (!loginId || !password) {
      this.notificationService.showError('Could not retrieve user credentials');
      return;
    }

    this.isSwitching = true;

    this.userSwitchService.loginAsUser(loginId, password, displayName, this.nextRole)
      .subscribe(
        (success: boolean) => {
          this.isSwitching = false;
          if (success) {
            this.bsModalRef.hide();
            // Navigate based on user type
            if (this.nextRole === 'dealer') {
              // Reload current admin page to refresh with new token
              window.location.reload();
            } else {
              // For customer/subuser, navigate to user dashboard
              window.location.href = 'user/dashboard/summary';
            }
          }
        },
        (error: any) => {
          this.isSwitching = false;
        }
      );
  }

  cancel(): void {
    this.bsModalRef.hide();
  }

  getUserLoginId(user: any): string {
    return user?.Customer?.User?.LoginId || user?.LoginId || user?.loginId || 'N/A';
  }

  getUserName(user: any): string {
    return user?.Customer?.CustomerName || user?.Dealer?.Name || user?.Name || user?.name || 'N/A';
  }

  getUserPassword(user: any): string {
    return user?.Customer?.User?.Password || user?.Password || user?.password || '';
  }

  getUserContact(user: any): string {
    return user?.Customer?.ContactNumber || user?.ContactNumber || user?.contactNumber || 'N/A';
  }

  getUserEmail(user: any): string {
    return user?.Customer?.Email || user?.Email || user?.email || 'N/A';
  }

  getDealerName(user: any): string {
    return user?.Dealer?.Name || user?.dealerName || 'N/A';
  }
}
