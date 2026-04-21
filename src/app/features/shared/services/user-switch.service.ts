import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { StorageService } from '../../http-services/storage.service';
import { JwtService } from '../../http-services/jwt.service';
import { NotificationService } from '../../http-services/notification.service';
import { UserService } from '../user/services/user.service';

export interface UserSession {
  token: string;
  userName: string;
  displayName: string;
  role: 'admin' | 'dealer' | 'customer' | 'subuser';
}

const USER_SWITCH_STACK_KEY = 'userSwitchStack';

@Injectable({
  providedIn: 'root'
})
export class UserSwitchService {
  private sessionStack: UserSession[] = [];
  private sessionStack$ = new BehaviorSubject<UserSession[]>([]);
  private switching$ = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private storageService: StorageService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {
    this.loadStackFromStorage();
  }

  // ─── Observables ───────────────────────────────────────────────

  getSessionStack(): Observable<UserSession[]> {
    return this.sessionStack$.asObservable();
  }

  isSwitching(): Observable<boolean> {
    return this.switching$.asObservable();
  }

  // ─── Active Token (used by interceptor) ────────────────────────

  /**
   * Returns the active JWT token (last entry in the stack).
   * This is what the HTTP interceptor should use for Authorization header.
   */
  getActiveToken(): string | null {
    if (this.sessionStack.length > 0) {
      return this.sessionStack[this.sessionStack.length - 1].token;
    }
    return localStorage.getItem('token');
  }

  // ─── Stack Info ────────────────────────────────────────────────

  getCurrentSession(): UserSession | null {
    if (this.sessionStack.length > 0) {
      return this.sessionStack[this.sessionStack.length - 1];
    }
    return null;
  }

  isInSwitchedSession(): boolean {
    return this.sessionStack.length > 1;
  }

  getSessionDepth(): number {
    return this.sessionStack.length;
  }

  // ─── Init Root ─────────────────────────────────────────────────

  /**
   * Initialize root session from current login.
   * Called once after successful login.
   */
  initRootSession(): void {
    // Don't re-initialize if stack already has entries
    if (this.sessionStack.length > 0) {
      return;
    }

    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    if (token && userName) {
      this.sessionStack = [{
        token,
        userName,
        displayName: userName,
        role: 'admin'
      }];
      this.saveStackToStorage();
      this.sessionStack$.next([...this.sessionStack]);
    }
  }

  // ─── Login As User (push to stack) ─────────────────────────────

  /**
   * Login as another user.
   * Calls the login API, gets a new JWT, pushes it onto the stack.
   * The interceptor will automatically pick up the new token.
   */
  loginAsUser(
    loginId: string,
    password: string,
    displayName: string,
    role: 'dealer' | 'customer' | 'subuser'
  ): Observable<boolean> {
    this.switching$.next(true);

    // Ensure root session exists
    if (this.sessionStack.length === 0) {
      this.initRootSession();
    }

    const payload = {
      loginId: loginId,
      password: password,
      loginDevice: 'web'
    };

    return this.userService.userLogin(payload).pipe(
      map((res: any) => {
        const response = res.body;
        this.switching$.next(false);

        if (response?.result === true && response?.data) {
          const tokenWithBearer = response.data;
          const tokenOnly = tokenWithBearer.startsWith('Bearer ')
            ? tokenWithBearer.substring(7)
            : tokenWithBearer;

          const newSession: UserSession = {
            token: tokenOnly,
            userName: loginId,
            displayName: displayName || loginId,
            role: role
          };

          // Push to stack
          this.sessionStack.push(newSession);
          this.saveStackToStorage();
          this.sessionStack$.next([...this.sessionStack]);

          // Also update localStorage so other parts of the app that read from it stay in sync
          localStorage.setItem('token', tokenOnly);
          localStorage.setItem('userName', loginId);

          this.notificationService.showSuccess(
            `Switched to ${displayName || loginId}`
          );

          return true;
        } else {
          this.notificationService.showError(
            response?.message || 'Failed to login as user'
          );
          return false;
        }
      }),
      catchError((error: any) => {
        this.switching$.next(false);
        this.notificationService.showError(
          'Failed to switch user: ' + (error?.error?.message || error?.message || 'Unknown error')
        );
        return of(false);
      })
    );
  }

  // ─── Switch to Level (discard everything after) ────────────────

  /**
   * Click on breadcrumb at index N → keep [0..N], discard [N+1, N+2, ...].
   * Updates the active token immediately. No page reload needed.
   */
  switchToLevel(index: number): void {
    if (index < 0 || index >= this.sessionStack.length) {
      return;
    }

    // Trim: keep items 0 through index, discard the rest
    this.sessionStack = this.sessionStack.slice(0, index + 1);
    this.saveStackToStorage();
    this.sessionStack$.next([...this.sessionStack]);

    // The active session is now the one at `index`
    const session = this.sessionStack[index];

    // Update localStorage so the rest of the app stays in sync
    localStorage.setItem('token', session.token);
    localStorage.setItem('userName', session.userName);

    this.notificationService.showSuccess(
      `Switched back to ${session.displayName}`
    );

    // Navigate to admin overview (since switching back means going to admin context)
    this.router.navigateByUrl('/admin/overview/admin-overview');
  }

  // ─── Go Back One Level ─────────────────────────────────────────

  goBack(): void {
    if (this.sessionStack.length <= 1) {
      return;
    }
    this.switchToLevel(this.sessionStack.length - 2);
  }

  // ─── Return to Root ────────────────────────────────────────────

  returnToRoot(): void {
    if (this.sessionStack.length <= 1) {
      return;
    }
    this.switchToLevel(0);
  }

  // ─── Clear (on logout) ────────────────────────────────────────

  clearStack(): void {
    this.sessionStack = [];
    this.saveStackToStorage();
    this.sessionStack$.next([]);
  }

  // ─── Persistence ──────────────────────────────────────────────

  private saveStackToStorage(): void {
    try {
      localStorage.setItem(USER_SWITCH_STACK_KEY, JSON.stringify(this.sessionStack));
    } catch (e) {
      console.error('Failed to save user switch stack', e);
    }
  }

  private loadStackFromStorage(): void {
    try {
      const stored = localStorage.getItem(USER_SWITCH_STACK_KEY);
      if (stored) {
        this.sessionStack = JSON.parse(stored);
        this.sessionStack$.next([...this.sessionStack]);
      }
    } catch (e) {
      console.error('Failed to load user switch stack', e);
      this.sessionStack = [];
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Admin';
      case 'dealer': return 'Dealer';
      case 'customer': return 'Customer';
      case 'subuser': return 'Sub User';
      default: return role;
    }
  }
}
