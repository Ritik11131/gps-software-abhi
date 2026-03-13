import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-unlink-confirm-modal',
  templateUrl: './unlink-confirm-modal.component.html',
  styleUrls: ['./unlink-confirm-modal.component.scss']
})
export class UnlinkConfirmModalComponent {
  /** User to unlink (set via modal initialState) */
  @Input() user: any = null;
  /** Device label for display (set via modal initialState) */
  @Input() deviceLabel: string = '';

  unlinkConfirmText = '';
  readonly UNLINK_CONFIRM = 'UNLINK';

  @Output() mapdata = new EventEmitter<any>();

  constructor(public bsModalRef: BsModalRef) {}

  get userName(): string {
    return this.user?.userName || this.user?.loginId || 'this user';
  }

  get canConfirmUnlink(): boolean {
    return this.unlinkConfirmText.trim().toUpperCase() === this.UNLINK_CONFIRM;
  }

  confirm() {
    if (!this.canConfirmUnlink) return;
    this.mapdata.emit({ confirmed: true, user: this.user });
    this.bsModalRef.hide();
  }

  cancel() {
    this.mapdata.emit({ confirmed: false });
    this.bsModalRef.hide();
  }
}
