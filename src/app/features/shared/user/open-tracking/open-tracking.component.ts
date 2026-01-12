import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import * as L from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'app-open-tracking',
  templateUrl: './open-tracking.component.html',
  styleUrls: ['./open-tracking.component.scss']
})
export class OpenTrackingComponent  implements OnInit, AfterViewInit, OnDestroy{
  map: any;
  key: string | any;
  timer: any = null;
  marker: any = null;
  polyline: any = null;
  zoom: number = 0;
  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private userService : UserService,
    private NotificationService: NotificationService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {

  }
 
  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  getAddress(address : any): void {
    const addressValue = {
      Lat:address?.Latitude,
      Lng:address?.Longitude
    }
    
    this.commonService.getAddressValue(addressValue)
      .subscribe((d) => {
        var content = this.marker.getPopup().getContent();
        content = content + `<b> Address: </b> ${d}`;
        this.marker.getPopup().setContent(content);
        this.marker.getPopup().update();
      });
  }

  addMarker(element: any): void {        
    if (element?.body?.Result?.Data?.ResultCode !== 1) {
      this.NotificationService.showError(element?.error?.Error?.Data);
      return;
    }

    const eventData = element?.body?.Result?.Data;
    if (eventData) {

      const content = `<b> Vehicle No: </b> ${eventData.Device.VehicleNo}  <br/> <b> Last Update: </b> ${this.datePipe.transform(eventData?.Eventdata?.Timestamp, 'yyyy-MM-dd HH:mm:ss')} <br/> <b> Speed: </b> ${eventData?.Eventdata?.Speed} Km/h <br/> `;
      const customIcon = L.icon({
        iconUrl: 'assets/drawable/rp_marker_marker_blue.png',
        iconSize: [45, 90],
      });
      if (this.marker === null) {
        this.marker = L.marker([eventData?.Eventdata.Latitude, eventData?.Eventdata?.Longitude],{ icon: customIcon });
        this.marker.addTo(this.map);
        var popup = L.popup().setContent(content);
        this.marker.bindPopup(popup);
      }
      else {
        this.marker.setLatLng([eventData?.Eventdata.Latitude, eventData?.Eventdata?.Longitude]);
        this.marker.getPopup().setContent(content);
        this.marker.getPopup().update();
      }

      this.getAddress(eventData?.Eventdata);
      this.addPointPolyline([eventData?.Eventdata.Latitude, eventData?.Eventdata?.Longitude]);

      var latLngs = [this.marker.getLatLng()];
      var markerBounds = L.latLngBounds(latLngs);
      if (this.zoom === 0) {
        this.map.fitBounds(markerBounds);
        this.map.setZoom(16);

        this.map.on("zoomend", () => {
          this.zoom = this.map.getZoom();
        });
      }

      if (!this.map.getBounds().contains([eventData.Latitude, eventData.Longitude])) {
        this.map.panTo(this.marker.getLatLng());
      }
    }
  }

  addPointPolyline(point: any): void {
    if (this.polyline === null) {
      var pointList = [point];
      this.polyline = new L.Polyline(pointList, {
        color: 'green',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
      });
      this.polyline.addTo(this.map);
      return;
    }
    this.polyline.addLatLng(point);
  }

  getLocation(): void {
    this.userService.getVehicleLastPoint(this.key)
      .subscribe((d) => {
        this.addMarker(d);
      }, (e) => {
        this.NotificationService.showError(e?.error?.Error?.Data);
        if (this.timer) {
          clearInterval(this.timer);
        }
      });
  }
  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [20.593683, 78.962883],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 4,
      attribution: '&copy; <a href="https://gpsvts.in/login">Gps Software</a>'
    });

    // const tiles = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    //   maxZoom: 18,
    //   minZoom: 4,
    //   attribution: '&copy; <a href="http://www.gpssoftware.in">Gps Software</a>',
    //   subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    // });

    tiles.addTo(this.map);

  //   const customIcon = L.icon({
  //     iconUrl: 'assets/drawable/rp_marker_marker_blue.png',
  //     iconSize: [45, 90],
  //   });
  //  L.marker([20.593683, 78.962883], { icon: customIcon }).addTo(this.map);
    // marker.bindPopup('');
    this.route.paramMap
      .subscribe(params => {
        this.key = params.get('key');
        if (this.key) {
          this.getLocation();
          this.timer = setInterval(() => { this.getLocation(); }, 10000);
        }
      });
  }
}
