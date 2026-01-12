import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-device-log-map',
  templateUrl: './device-log-map.component.html',
  styleUrls: ['./device-log-map.component.scss']
})
export class DeviceLogMapComponent {
  vehicleNo: any
  latitude: any
  longitude: any
  map: any;
  marker: google.maps.Marker[] = [];
  zoom = 17;
  constructor(
    private bsmodelService: BsModalService,

  ) { }

  ngOnInit() {
    this.initializeMap(this.latitude, this.longitude, this.zoom)
  }

  initializeMap(lat: any, long: any, zoomvalue: any) {
    const mapOptions = {
      center: { lat: lat, lng: long },
      zoom: zoomvalue,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    this.map = new google.maps.Map(document.getElementById('new-map') as HTMLDivElement, mapOptions);
    this.map.setOptions({
      mapTypeControl: false
    });

    const marker = new google.maps.Marker({
      position: { lat: lat, lng: long },
      map: this.map,
      // icon: {
      //   url: 'assets/drawable/rp_marker_marker_blue.png',
      //   scaledSize: new google.maps.Size(60, 60),
      // },
    });
    this.marker.push(marker);
  }

  cancel() {
    this.bsmodelService.hide()
  }
}
