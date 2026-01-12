import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  readonly VAPID_PUBLIC_KEY = 'NsS9cd8ARNKzUY-J4A9VNM78ep2xbPlTWEqQ-25Q1W4'; // Replace with your VAPID public key



  constructor(private swPush: SwPush) {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => {
      // Send subscription to your server
    })
    .catch(err => console.error('Could not subscribe to notifications', err));
  }
}
