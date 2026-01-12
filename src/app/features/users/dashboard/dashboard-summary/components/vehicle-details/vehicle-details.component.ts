import { Component, Input } from '@angular/core';

@Component({
  selector: 'vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent {
  @Input() data: any;
}
