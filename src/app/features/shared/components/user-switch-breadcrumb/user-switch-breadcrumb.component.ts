import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserSession, UserSwitchService } from '../../services/user-switch.service';

@Component({
  selector: 'user-switch-breadcrumb',
  templateUrl: './user-switch-breadcrumb.component.html',
  styleUrls: ['./user-switch-breadcrumb.component.scss']
})
export class UserSwitchBreadcrumbComponent implements OnInit, OnDestroy {
  sessionStack: UserSession[] = [];
  isSwitching: boolean = false;

  private stackSub!: Subscription;
  private switchingSub!: Subscription;

  constructor(
    public userSwitchService: UserSwitchService
  ) {}

  ngOnInit(): void {
    this.stackSub = this.userSwitchService.getSessionStack().subscribe(stack => {
      this.sessionStack = stack;
    });
    this.switchingSub = this.userSwitchService.isSwitching().subscribe(switching => {
      this.isSwitching = switching;
    });

    // Initialize root session if stack is empty but user is logged in
    if (this.sessionStack.length === 0 && localStorage.getItem('token')) {
      this.userSwitchService.initRootSession();
    }
  }

  ngOnDestroy(): void {
    this.stackSub?.unsubscribe();
    this.switchingSub?.unsubscribe();
  }

  switchToLevel(index: number): void {
    if (index === this.sessionStack.length - 1) {
      return; // Already at this level
    }
    this.userSwitchService.switchToLevel(index);
  }

  goBack(): void {
    this.userSwitchService.goBack();
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'admin': return 'fa-user-shield';
      case 'dealer': return 'fa-store';
      case 'customer': return 'fa-user';
      case 'subuser': return 'fa-user-circle';
      default: return 'fa-user';
    }
  }
}
