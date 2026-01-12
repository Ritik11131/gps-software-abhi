import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { UserService } from '../shared/user/services/user.service';
import { SharedService } from './shared.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AlertPopupComponent } from '../shared/components/alert-popup/alert-popup.component';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private timerSubject: Subject<number> = new Subject<number>();
  private timerSubscription: any; // Store the subscription to the timer
  data: any;
  newData: any;

  constructor(
    private userservice : UserService,
    private shardService : SharedService,
    private modalService: BsModalService,
  ) {}

  startTimer(durationInMinutes: number) {
    const durationInSeconds = durationInMinutes * 60;

    this.timerSubscription = timer(0, 1000).pipe(
      takeWhile((count) => count <= durationInSeconds)
    ).subscribe((count) => {
      const remainingTime = durationInSeconds - count;
      this.timerSubject.next(remainingTime);
      if (remainingTime === 0) {
        this.fireAPIAndRestartTimer(durationInMinutes);
      }
    });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe(); // Stop the timer subscription
    }
  }

  getTimerObservable(): Observable<number> {
    return this.timerSubject.asObservable();
  }
  bsModalRef!: BsModalRef
  private isModalOpen = false;
  private fireAPIAndRestartTimer(durationInMinutes: number) {
    let payload = {
      "TimeRecorded":this.shardService.formatedTime(new Date()) 
    }

    this.userservice.alertcall(payload).subscribe((res: any) => {
      this.data  = res?.body?.data;
      
      const currentTime = new Date();
      const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60000);
      const last5MinutesData = this.data.filter((item:any) => {
        const recordedTime = new Date(item.timeRecorded);
        return recordedTime >= fiveMinutesAgo && recordedTime <= currentTime;
      });
      this.newData = last5MinutesData
      
      this.startTimer(durationInMinutes);
      if(this.newData.length > 0) { 
        if (this.isModalOpen && this.bsModalRef) {
          this.bsModalRef.hide();
          this.isModalOpen = false;
        }     
        const initialState: ModalOptions = {
          initialState: {
            data: this.newData,
          },
        };
        this.bsModalRef = this.modalService.show(
          AlertPopupComponent,
          Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
        );
      }
      this.isModalOpen = true;
  
    })
    
  }
}
