import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoefanceListComponent } from '../goefance-list/goefance-list.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'create-geofance',
  templateUrl: './create-geofance.component.html',
  styleUrls: ['./create-geofance.component.scss']
})
export class CreateGeofanceComponent {

  @ViewChild('geofanceDetails', { static: true }) geolist!: GoefanceListComponent;
  map: google.maps.Map | any;
  marker: google.maps.Marker[] = [];
  lat = 20.5937;
  lng = 78.9629
  zoom = 5;
  drawingManager: google.maps.drawing.DrawingManager | any;
  drawnPolygon: google.maps.Polygon | any;
  drawnCircle: google.maps.Circle | any;
  polygonCoordinates: google.maps.LatLng[] | any;
  drawnCircleCordiante: google.maps.LatLng[] | any;
  currentInfoWindow: google.maps.InfoWindow | null = null;
  cornerMarkers: google.maps.Marker[] = [];
  selectedCoordinate: google.maps.LatLng | any;
  spinnerLoading = false;
  cricleRadious: any;
  circleRadius: number = 300;
  @ViewChild('geo-input', { static: true }) geoInput!: ElementRef;
  autocomplete!: google.maps.places.Autocomplete;
  latlngvalue: string | null = null;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    // this.spinnerLoading = true
    this.initializeMap(this.lat, this.lng, this.zoom);
    // this.spinnerLoading = false;

  }

  ngAfterViewInit() {
    this.searchValue()
  }

  searchValue() {
    this.latlngvalue = null
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('geo-input') as HTMLInputElement,
      {
        types: ['geocode'],
        componentRestrictions: {
          country: 'IN'
        }
      }
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        return;
      }

      const map = new google.maps.Map(
        document.getElementById('geomap') as HTMLElement,
        {
          center: place.geometry.location,
          zoom: 15,
        }
      );

      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location
      });
      this.circleRadius = 300
      this.drawnCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: place.geometry.location,
        radius: this.circleRadius
      });   
      const circleCenter = this.drawnCircle.getCenter();
      const circleRadius = this.drawnCircle.getRadius();
      this.geolist?.setData((circleCenter), circleRadius, 2)


      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.CIRCLE
          ]
        },
        polygonOptions: {
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        },
        circleOptions: {
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        }
      });

      drawingManager.setMap(map);

      // let drawnPolygon: google.maps.Polygon | null = null;
      // let drawnCircle: google.maps.Circle | null = null;

      google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          if (this.drawnCircle) {
            this.drawnCircle.setMap(null);
            this.drawnCircle = null;
          }
          if (this.drawnPolygon) {
            this.drawnPolygon.setMap(null);
          }
          this.drawnPolygon = event.overlay as google.maps.Polygon;
          const polygonCoordinates = this.drawnPolygon.getPath().getArray();
          this.geolist?.setData((polygonCoordinates), 0, 1)
        } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
          if (this.drawnPolygon) {
            this.drawnPolygon.setMap(null);
            this.drawnPolygon = null;
          }
          if (this.drawnCircle) {
            this.drawnCircle.setMap(null);
          }
          this.drawnCircle = event.overlay as google.maps.Circle;
          const circleCenter = this.drawnCircle.getCenter();
          const circleRadius = this.drawnCircle.getRadius();
          this.geolist?.setData((circleCenter), circleRadius, 1)

        }
      });
    });

    const dropdownBounds = new google.maps.MVCObject();
    dropdownBounds.set('bounds', new google.maps.LatLngBounds());

    this.autocomplete.bindTo('bounds', dropdownBounds);
  }


  initializeMap(lat: any, long: any, zoomvalue: any) {
    const mapOptions = {
      center: { lat: lat, lng: long }, // India's center coordinates
      zoom: zoomvalue,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    this.map = new google.maps.Map(document.getElementById('geomap') as HTMLDivElement, mapOptions);
    this.marker = [new google.maps.Marker({
      position: { lat, lng: long },
      map: this.map,
    })];
    this.initializeDrawingManager();
  }

  initializeDrawingManager() {
    if (this.drawnPolygon) {
      this.drawnPolygon.setMap(null);
    }
    if (this.drawnCircle) {
      this.drawnCircle.setMap(null);
    }

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.CIRCLE
        ]
      },
      polygonOptions: {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      },
      circleOptions: {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      }
    });

    this.drawingManager.setMap(this.map);

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: any) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        if (this.drawnPolygon) {
          this.drawnPolygon.setMap(null);
        }
        if (this.drawnCircle) {
          this.drawnCircle.setMap(null);
        }
        this.drawnPolygon = event.overlay as google.maps.Polygon;
        this.polygonCoordinates = this.drawnPolygon.getPath().getArray();
        this.geolist?.setData((this.polygonCoordinates), 0, 1)


      } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {        
        if (this.drawnCircle) {
          this.drawnCircle.setMap(null);
        }
        if (this.drawnPolygon) {
          this.drawnPolygon.setMap(null);
        }
        this.drawnCircle = event.overlay as google.maps.Circle;
        this.drawnCircleCordiante = this.drawnCircle.getCenter();
        this.cricleRadious = this.drawnCircle.getRadius();
        this.circleRadius = this.cricleRadious
        this.geolist?.setData((this.drawnCircleCordiante), this.cricleRadious, 2)
      }
    });
  }

  removeCornerMarkers() {
    if (this.map) {
      this.map.setZoom(5);
  } else {
      console.error('Map instance is null or undefined');
  }
  const position = new google.maps.LatLng(this.lat, this.lng);
  if (this.marker.length > 0) {
      this.marker[0].setPosition(position);
  } else {
      console.error('No marker found');
  }

    if (this.drawnPolygon) {
      this.drawnPolygon.setMap(null);
      this.drawnPolygon = null;
      this.polygonCoordinates = null;
      this.geolist?.setData((this.polygonCoordinates), 0, 1)

    }
    if (this.drawnCircle) {
      this.drawnCircle.setMap(null);
      this.drawnCircle = null;
      this.drawnCircleCordiante = null;
      this.cricleRadious = null;
      this.geolist?.setData((this.drawnCircleCordiante), this.cricleRadious, 2)

    }
    this.cornerMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.cornerMarkers = [];
  }

  confirm(event: any) {
    if (!event || event == null) {
      this.removeCornerMarkers()
    } else {
      const mapOptions = {
        center: { lat: event?.Points[0]?.Lat, lng: event?.Points[0]?.Lng }, // India's center coordinates
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.TERRAIN
      };

      this.map = new google.maps.Map(document.getElementById('geomap') as HTMLDivElement, mapOptions);
      this.initializeDrawingManager();

    }
    let corners = event?.Points;
    let radius = event?.Radius;

    if (corners && radius != 0) {
      const polygonCoordinates = corners.map((corner: any) => {
        return new google.maps.LatLng(corner.Lat, corner.Lng);
      });

      // Remove the previously drawn polygon
      if (this.drawnPolygon) {
        this.drawnPolygon.setMap(null);
      }

      // Create a new polygon with the given coordinates
      this.drawnPolygon = new google.maps.Polygon({
        paths: polygonCoordinates,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });

      this.drawnPolygon.setMap(this.map);

      // Draw a circle with the given radius
      const circleCenter = new google.maps.LatLng(corners[0].Lat, corners[0].Lng);
      if (this.drawnCircle) {
        this.drawnCircle.setMap(null);
      }
      this.drawnCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: this.map,
        center: circleCenter,
        radius: radius
      });
    } else if (corners && radius == 0) {
      if (corners) {
        const polygonCoordinates = corners.map((corner: any) => {
          return new google.maps.LatLng(corner.Lat, corner.Lng);
        });

        // Remove the previously drawn polygon and circle
        if (this.drawnPolygon) {
          this.drawnPolygon.setMap(null);
        }
        if (this.drawnCircle) {
          this.drawnCircle.setMap(null);
        }

        // Create a new polygon with the given coordinates
        this.drawnPolygon = new google.maps.Polygon({
          paths: polygonCoordinates,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });

        this.drawnPolygon.setMap(this.map);
      }

    }
  }



  change(event: any) {
    this.latlngvalue = null
  }

  changeLatLng(event: any) { 
    this.initializeMap(this.lat, this.lng, this.zoom); 
    let geoInputElement:any = document.getElementById('geo-input')  as HTMLElement;
    if (geoInputElement) {
        geoInputElement.value = null;
    }

     const inputValue = (event.target as HTMLInputElement).value.split(',')
    
    const apiKey = 'AIzaSyCWvUzk2vVzV_jpGBAV4AxwvyMn47O3ekQ';
    let lat = inputValue[0];
    let lng = inputValue[1]
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    this.http.get(url).subscribe((res: any) => {
      if (res.results && res.results.length > 0) {
        const location = res.results[0].geometry.location;
        const formattedAddress = res.results[0].formatted_address;
  
        this.map.setCenter(location);
        this.map.setZoom(15)
        this.marker[0].setPosition(location);        
        this.createDefaultCircle(location, 300);
      } else {
        console.error('No results found');
      }
    });
  }

  createDefaultCircle(center: google.maps.LatLngLiteral, radius: number) {
    if (this.drawnCircle) {
      this.drawnCircle.setMap(null);
    }
    
    this.drawnCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: center,
      radius: radius
    });
    const circleCenter = this.drawnCircle.getCenter();
    const circleRadius = this.drawnCircle.getRadius();
    this.geolist?.setData((circleCenter), circleRadius, 2)
  }

  increaseRadius() {
    this.circleRadius += 100; 
    this.updateCircleRadius();
  }

  decreaseRadius() {
    this.circleRadius -= 100;
    this.updateCircleRadius();
  }

  updateCircleRadius() {
    if (this.drawnCircle) {
      this.drawnCircle.setRadius(this.circleRadius);
      const circleCenter = this.drawnCircle.getCenter();
      this.geolist?.setData((circleCenter), this.circleRadius, 2)

    }
  }


  // confirm(event: any) {
  //   let corners = event?.Points;
  //   let radius = event?.Radius;

  //   if (corners) {
  //     const polygonCoordinates = corners.map((corner: any) => {
  //       return new google.maps.LatLng(corner.Lat, corner.Lng);
  //     });

  //     // Remove the previously drawn polygon and circle
  //     if (this.drawnPolygon) {
  //       this.drawnPolygon.setMap(null);
  //     }
  //     if (this.drawnCircle) {
  //       this.drawnCircle.setMap(null);
  //     }

  //     // Create a new polygon with the given coordinates
  //     this.drawnPolygon = new google.maps.Polygon({
  //       paths: polygonCoordinates,
  //       strokeColor: '#FF0000',
  //       strokeOpacity: 0.8,
  //       strokeWeight: 2,
  //       fillColor: '#FF0000',
  //       fillOpacity: 0.35
  //     });

  //     this.drawnPolygon.setMap(this.map);

  //     // If radius is provided, draw a circle with the given radius
  //     if (radius !== undefined) {
  //       const center = corners; // Assume the first coordinate as the center

  //       this.drawnCircle = new google.maps.Circle({
  //         strokeColor: '#FF0000',
  //         strokeOpacity: 0.8,
  //         strokeWeight: 2,
  //         fillColor: '#FF0000',
  //         fillOpacity: 0.35,
  //         center: center,
  //         radius: radius
  //       });

  //       this.drawnCircle.setMap(this.map);
  //     }
  //   }
  // }
}


