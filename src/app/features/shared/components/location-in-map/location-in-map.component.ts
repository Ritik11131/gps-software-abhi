import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-location-in-map',
  templateUrl: './location-in-map.component.html',
  styleUrls: ['./location-in-map.component.scss']
})
export class LocationInMapComponent {
  data: any
  map: any;
  markers: google.maps.Marker[] = [];
  lat = 28.5851;
  lng = 77.3116;
  zoom = 13;

  constructor(private modalService: BsModalService,) { }

  ngOnInit() {
    this.initializeMap(this.lat, this.lng, this.zoom);
    if(this.data) {
      this.calculateAndDisplayRoute()
    }
  }

  initializeMap(lat: any, long: any, zoomvalue: any) {
    const mapOptions = {
      center: { lat: lat, lng: long },
      zoom: zoomvalue,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    this.map = new google.maps.Map(document.getElementById('liveMap') as HTMLDivElement, mapOptions);
    const marker = new google.maps.Marker({
      position: { lat: lat, lng: long },
      map: this.map,
      icon: {
        url: '',
        scaledSize: new google.maps.Size(30, 30),
      },
    });
    this.markers.push(marker);
  }


  calculateAndDisplayRoute() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3,
            fillColor: 'black',
            fillOpacity: 1.0
          },
          offset: "100%",
          repeat: "100px"
        }]
      }
    });
  
    const origin = { lat: this.data.Start.Lat, lng: this.data.Start.Lng };
    const destination = { lat: this.data.End.Lat, lng: this.data.End.Lng };
  
    const originMarker = new google.maps.Marker({
      position: origin,
      map: this.map,
      title: 'Start Point',
  
    });
  
    const destinationMarker = new google.maps.Marker({
      position: destination,
      map: this.map,
      title: 'End Point',

    });
  
    // InfoWindows for origin and destination
    const originInfoWindow = new google.maps.InfoWindow({
      content: '<div><strong>Start Point</strong><br>Latitude: ' + origin.lat + '<br>Longitude: ' + origin.lng + '</div>'
    });
  
    const destinationInfoWindow = new google.maps.InfoWindow({
      content: '<div><strong>End Point</strong><br>Latitude: ' + destination.lat + '<br>Longitude: ' + destination.lng + '</div>'
    });
  
    // Add click listeners to open the info windows
    originMarker.addListener('click', () => {
      originInfoWindow.open(this.map, originMarker);
    });
  
    destinationMarker.addListener('click', () => {
      destinationInfoWindow.open(this.map, destinationMarker);
    });
  
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
          directionsRenderer.setMap(this.map);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  
    // Open the info windows automatically when the map loads
    originInfoWindow.open(this.map, originMarker);
    destinationInfoWindow.open(this.map, destinationMarker);
  }
  

  getAddress () {
    // this.commonService.getAddressValue(data.Loc).subscribe(
    //   (res: any) => {})
  }


  cancel() {
    this.modalService.hide();
  }

}
