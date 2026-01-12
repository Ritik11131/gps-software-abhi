import { Component } from '@angular/core';

@Component({
  selector: 'vehicle-status',
  templateUrl: './vehicle-status.component.html',
  styleUrls: ['./vehicle-status.component.scss']
})
export class VehicleStatusComponent {

  showCardData: boolean = false;
  addressHeight: number = 0;

  toggleStatus() {
    this.showCardData = !this.showCardData;
    this.setAddressHeight();
  }

  setAddressHeight() {
    const addressElement = document.querySelector('.address');
    if (addressElement) {
      this.addressHeight = addressElement.clientHeight;
    }
  }
}
