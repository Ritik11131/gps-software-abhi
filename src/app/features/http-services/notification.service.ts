import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  /**
   * show success toastr
   * @param message 
   */
  showSuccess(message: string) {
    this.toastr.success(message);
  }

  /**
   * show eroor toastr
   * @param message 
   */
  showError(message: string) {
    this.toastr.error(message);
  }


  /**
   * show information toastr
   * @param message 
   */
  showInfo(message: string) {
    this.toastr.info(message);
  }


  /**
   * show warning tastr
   * @param message 
   */
  showWarning(message: string) {
    this.toastr.warning(message);
  }
}
