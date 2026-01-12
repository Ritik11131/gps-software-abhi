import { AgmMap } from '@agm/core';
import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map, catchError, of, Observable, from, bufferCount, concatMap, delay } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/features/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'src/app/features/shared/services/common.service';
import { UserService } from 'src/app/features/shared/user/services/user.service';
import { DashboardService } from 'src/app/features/users/dashboard/dashboard-summary/services/dashboard.service';
import { TrackingService } from 'src/app/features/users/tracking/manage-tracking/services/tracking.service';
import { AdminDashboardService } from '../../services/admin-dashboard.service';

@Component({
  selector: 'app-admin-history-tracking',
  templateUrl: './admin-history-tracking.component.html',
  styleUrls: ['./admin-history-tracking.component.scss']
})
export class AdminHistoryTrackingComponent {
  @ViewChild(AgmMap) agmMap!: AgmMap;
  @Output() sliderValueevent = new EventEmitter<number>();
  bsModalRef!: BsModalRef
  lat = 28.5851;
  lng = 77.3116;
  zoom = 13;
  historyForm!: FormGroup;
  vehicleData: any;
  bsValue = new Date();
  selectedVehicleId: any;
  filterSelectId: any;
  historylist: any;
  stoppageData: any;
  wapointmarker: google.maps.Marker | any;
  wapointmarkerpolylines: google.maps.Polyline | any;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  map: any;
  polyline: google.maps.Polyline | any ;
  busRoute: any;
  infoWindow: any;
  animationInterval: any;
  speedMultipliers = 1;
  markers: google.maps.Marker[] = [];
  responseroute: any = [];
  car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
  carIcon = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 6, // Increased scale for better visibility
    strokeColor: '#FFFFFF', // White border for contrast
    strokeWeight: 2, // Thicker border for prominence
    fillColor: 'blue', // Vibrant tomato red fill color
    fillOpacity: 1,
  //  rotation: 0
  };
  topSpeed: any;
  historyData: any;

  overSpeedvalue: any;
  isOverSpeed: boolean = false;
  spinnerLoading: boolean = false;
  selectDate = [
    { id: 1, dateValue: 'Today' },
    { id: 2, dateValue: 'Yesterday' },
    { id: 3, dateValue: 'Weekly' },
    { id: 6, dateValue: 'Custom' }
  ];
  speed = [
    { id: 1, speed: 'x1' },
    { id: 2, speed: 'x2' },
    { id: 3, speed: 'x3' },
    { id: 4, speed: 'x4' },
    { id: 5, speed: 'x5' },
    { id: 6, speed: 'x6' },
    { id: 7, speed: 'x7' },
    { id: 8, speed: 'x8' }
  ];

  tripReport: any;
  stoppageMarkers: any;
  durationTime: any;
  totaldistanceValue: any = 0;
  sliderValue: number = 0;
  currentAnimationIndex: number = 0;
  isPlaying: boolean = false;
  customDate: boolean = false;
  timeformate: boolean = false;
  isHide: boolean = false;
  startIndex: any;
  selectTrip: any;
  tripValue: any;
  selectedType: any;
  tripType: boolean = false;
  isLoading:boolean = false;
  selectedCustomer: any;
  totalDistanceKm = 0;
  totalDistance = 0;
  isPolylineUpdating:boolean = false;


  constructor(
    private dashboardService: AdminDashboardService,
    private fb: FormBuilder,
    private trackingService: TrackingService,
    private activeroute: ActivatedRoute,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private commonService: CommonService,
  ) {
    this.minDate = new Date();
    this.maxDate = new Date();

  }

  ngOnInit() {
    this.setInitialValue();
    this.initializeMap(this.lat, this.lng, this.zoom);
   this.selectedCustomer = this.activeroute.snapshot.paramMap.get("cusId");
    this.selectedVehicleId = this.activeroute.snapshot.paramMap.get("id");
    if(this.selectedCustomer){
      this.getVehicleData(this.selectedCustomer);
    }
  }

  bsRangeValue!: Date[];
  minDate: Date | any;
  maxDate: Date | any;

  setInitialValue() {
    const currentDate = new Date();
    const currentDayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    currentDayStart.setHours(0, 0, 1);

    const currentDayEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    currentDayEnd.setHours(23, 59, 59);

    this.historyForm = this.fb.group({
      deviceId: [null, [Validators.required]],
      timeformat: ['Today', [Validators.required]],
      fromDate: [currentDayStart],
      toDate: [currentDayEnd]
    });

    this.historyForm.get('timeformat')?.valueChanges.subscribe(value => {
      if (value === 'Custom') {
        this.historyForm.get('fromDate')?.setValue(currentDayStart);
        this.historyForm.get('toDate')?.setValue(currentDayEnd);
      } else {
        let newFromDate = new Date(currentDayStart);
        let newToDate = new Date(currentDayEnd);

        switch (value) {
          case 'Yesterday':
            newFromDate.setDate(currentDate.getDate() - 1);
            newToDate.setDate(currentDate.getDate() - 1);
            newToDate.setHours(23, 59, 59);
            break;
          case 'Weekly':
            newFromDate.setDate(currentDate.getDate() - 7);
            break;
          case '15 Days':
            newFromDate.setDate(currentDate.getDate() - 15);
            break;
          case '30 Days':
            newFromDate.setDate(currentDate.getDate() - 30);
            break;
          default:
            break;
        }
        this.historyForm.get('fromDate')?.setValue(newFromDate);
        this.historyForm.get('toDate')?.setValue(newToDate);
      }
    });
  }

  initializeMap(lat: any, long: any, zoomvalue: any) {
    const mapOptions = {
      center: { lat: lat, lng: long },
      zoom: zoomvalue,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    this.map = new google.maps.Map(document.getElementById('histroyTrack') as HTMLDivElement, mapOptions);
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

  getVehicleData(id:any) {
    this.dashboardService.customerVehicle(id).subscribe((res: any) => {
      this.vehicleData = res?.body?.Result?.Data;
      if (this.selectedVehicleId) {
        this.isOverSpeed = true;
        let newVehicleData = this.vehicleData?.filter((ele: any) => ele?.Device?.Id == this.selectedVehicleId);        
        newVehicleData?.forEach((data: any) => {
          this.filterSelectId = data?.Device?.VehicleNo;
          this.timeformate = true;
          this.historyForm.controls['deviceId'].patchValue(this.filterSelectId);
        });
      }
    });
  }

  mapReady(map: google.maps.Map) {
    this.map = map;
    this.infoWindow = new google.maps.InfoWindow();
  }

  submit(type: any,formvalue?: any,) {
    this.totaldistanceValue = 0;
    this.totalDistanceKm = 0;
    this.totalDistance = 0;
    this.selectedType = type;
    this.startIndex = 0;
    this.spinnerLoading = true;
    this.isPlaying = false;
    this.topSpeed = 0
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
    clearInterval(this.animationInterval);
    this.clearPolyline();
    if (this.wapointmarkerpolylines) {
      this.wapointmarkerpolylines.setMap(null);
    }
    if (this.wapointmarker) {
      this.wapointmarker.setMap(null);
    }
   
    this.initializeMap(this.lat, this.lng, this.zoom);
    let payload:any;
    if(type === 'history') {
      this.tripReport = [];
      this.tripType = false
      this.isLoading = true   
      payload = {
        "DeviceID": Number(this.selectedVehicleId ? this.selectedVehicleId : formvalue?.deviceId),
        "FromTime": formatDate(formvalue.fromDate, 'yyyy-MM-dd HH:mm:ss', 'en-Us'),
        "toTime": formatDate(formvalue.toDate, 'yyyy-MM-dd HH:mm:ss', 'en-Us'),
        "CustomerId":this.selectedCustomer
      };

    } else {
      payload = this.tripValue
    }
    this.dashboardService.adminLivetrackinghistory(payload).subscribe((res: any) => {
      this.spinnerLoading = false;
      this.isLoading = false
      if (res?.body?.Result == null) {
        this.tripReport = [];
        this.openConfirmationModal({
          title: "No Data",
          content: "No data found for selected time or device",
          primaryActionLabel: 'Ok',
          secondaryActionLabel: false,
          onPrimaryAction: () => {
            this.hideConfirmationModal();
          },
        });
      } else {
        this.historyData = res?.body?.Result?.Data;
        this.historylist = res?.body?.Result?.Data?.Position;   
        this.addMarker(this.historylist[0].Latitude, this.historylist[0].Longitude, 'Start Point', true, false);
        this.addMarker(this.historylist[this.historylist.length -1].Latitude, this.historylist[this.historylist.length -1].Longitude, 'End Point', false, true);
       console.log(res?.body?.Result?.Data?.DistanceV1s[0]?.totaldistance);
       
        if(type == 'trip'){
          this.totaldistanceValue = this.selectTrip?.distance 
        }else{
          console.log("lsjdlfd",res?.body?.Result?.Data?.DistanceV1s[0]?.totaldistance);

          this.totaldistanceValue = res?.body?.Result?.Data?.DistanceV1s[0]?.totaldistance;          
          this.getTripReport(formvalue,'history');
        }

        this.userService.historycount(this.historylist.length);
        this.stoppageData = res?.body?.Result?.Data?.Stoppages;        
        this.addMarker(this.historylist[0].Latitude, this.historylist[0].Longitude, 'Start Point', true, false);
        this.addMarker(this.historylist[this.historylist.length -1].Latitude, this.historylist[this.historylist.length -1].Longitude, 'End Point', false, true);
        this.updatePolyline(this.historylist);
      }
    });
  }

  updatePolyline(historylist: any[]) {
    if (!historylist || historylist.length === 0) {
      return;
    }
    if (this.isPolylineUpdating) {
      return;
    }
    this.isPolylineUpdating = true;

  
    // Clear previous polylines and markers
    if (this.wapointmarkerpolylines) {
      this.wapointmarkerpolylines.setMap(null);
    }
    if (this.wapointmarker) {
      this.wapointmarker.setMap(null);
    }
  
    // Convert history data to lat-lng for the map
    this.busRoute = historylist.map((bus: any) => ({
      lat: parseFloat(bus.Latitude),
      lng: parseFloat(bus.Longitude),
      speed: bus.Speed,
      time: bus.Timestamp
    }));
  
    // Create polyline for the bus route
    this.wapointmarkerpolylines = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: '', // Color dynamically assigned per segment
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: this.map
    });
  
    // Add a marker for the first point in the route
    this.wapointmarker = new google.maps.Marker({
      map: this.map,
      icon: this.carIcon,
      position: this.busRoute[0],
      optimized: false
    });
  
    this.clearPolyline();
  
    this.topSpeed = Math.max(...this.busRoute.map((item: any) => item.speed));
  
    const bounds = new google.maps.LatLngBounds();
    let totalDistanceMeters = 0;
    let index = 0;
  
    from(this.busRoute)
      .pipe(
        bufferCount(10), 
        concatMap((segment) => 
          from(segment).pipe(delay(10)) 
        )
      )
      .subscribe({
        next: (busPoint: any) => {
          if (index > 0) {
            const prevPoint = new google.maps.LatLng(
              this.busRoute[index - 1].lat, 
              this.busRoute[index - 1].lng
            );
            const currPoint = new google.maps.LatLng(busPoint.lat, busPoint.lng);
              let color = '#39FF13'; 
            if (this.overSpeedvalue && parseFloat(this.overSpeedvalue) < busPoint.speed) {
              color = 'red';
            }
  
            const polylineSegment = new google.maps.Polyline({
              geodesic: true,
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 4,
              map: this.map
            });
  
            polylineSegment.setPath([prevPoint, currPoint]);
            bounds.extend(currPoint);
  
            const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(prevPoint, currPoint);
            totalDistanceMeters += distanceMeters;
  
            const currentPath = this.wapointmarkerpolylines.getPath();
            currentPath.push(currPoint);
          }
          index++;
        },
        complete: () => {
          const totalDistanceKm = totalDistanceMeters / 1000;  
          // this.map.fitBounds(bounds);
  
          // this.clearStoppageMarkers();
          this.isPolylineUpdating = false;
        }
      });
  }

  addStoppage() {
    if (!this.stoppageData || this.stoppageData.length === 0) {
      console.error("No stoppage data available.");
      return;
    }

    try {
      for (let i = 0; i < this.stoppageData.length; i++) {
        const stoppage = this.stoppageData[i];
        if (!stoppage || !stoppage.Loc || !stoppage.Loc.Lat || !stoppage.Loc.Lng || !stoppage.Location || !stoppage.Duration) {
          console.error(`Invalid stoppage data at index ${i}:`, stoppage);
          continue;
        }

        const durationParts = stoppage.Duration.split(':');
        let durationInMinutes = 0;
        if (durationParts.length === 3) {
          const hours = parseInt(durationParts[0]);
          const minutes = parseInt(durationParts[1]);
          const seconds = parseInt(durationParts[2]);

          if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            console.error(`Invalid duration at index ${i}:`, stoppage);
            continue;
          }

          durationInMinutes = hours * 60 + minutes + seconds / 60;
        } else if (durationParts.length === 2) {
          const minutes = parseInt(durationParts[0]);
          const seconds = parseInt(durationParts[1]);

          if (isNaN(minutes) || isNaN(seconds)) {
            console.error(`Invalid duration at index ${i}:`, stoppage);
            continue;
          }

          durationInMinutes = minutes + seconds / 60;
        } else {
          console.error(`Invalid duration format at index ${i}:`, stoppage.Duration);
          continue;
        }

        if (durationInMinutes > 5) {
          this.durationTime = stoppage.Duration;
        } else {
          continue;
        }

        const lat = parseFloat(stoppage.Loc.Lat);
        const lng = parseFloat(stoppage.Loc.Lng);
        if (isNaN(lat) || isNaN(lng)) {
          console.error(`Invalid latitude or longitude at index ${i}:`, stoppage);
          continue;
        }

        const iconSize = new google.maps.Size(23, 23);
        const position = { lat, lng };
        const stoppageMarker = new google.maps.Marker({
          position,
          map: this.map,
          title: 'Stoppage',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: iconSize
          }
        });
        stoppageMarker.addListener('click', () => {
          let durationToShow = stoppage.Duration;
          if (durationInMinutes > 5 && durationParts.length === 2) {
            durationToShow = `${durationInMinutes.toFixed(2)} minutes`;
          }
          this.getAddress(stoppage).then(address => {
            const infoWindow = new google.maps.InfoWindow({
              content: `${address || ''}<br>Duration: ${durationToShow}`
            });
            infoWindow.open(this.map, stoppageMarker);
          });
        });
        this.markers.push(stoppageMarker);
      }
    } catch (error) {
      console.error("Error in addStoppage:", error);
    }
  }

  async getAddress(stop: any): Promise<string> {
    const address = {
      Lat: stop?.Loc?.Lat,
      Lng: stop?.Loc?.Lng
    };

    try {
      const res = await this.commonService.getAddressValue(address).toPromise();
      return res || '';
    } catch (error) {
      console.error("Error getting address:", error);
      return '';
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  clearPolyline() {
    this.polyline?.setMap(this.map);
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
  }

  clearStoppageMarkers() {
    if (this.markers) {
      this.markers.forEach((marker: google.maps.Marker) => {
        marker.setMap(null);
      });
      this.markers = [];
    }
    // if(this.historylist){
    //   this.addMarker(this.historylist[0].Latitude, this.historylist[0].Longitude, 'Start Point', true, false);
    //   this.addMarker(this.historylist[this.historylist.length -1].Latitude, this.historylist[this.historylist.length -1].Longitude, 'End Point', false, true);
    // }

  }

  play() {
    clearInterval(this.animationInterval);
    this.animateMarkers(this.startIndex);
  }

  pause() {
    clearInterval(this.animationInterval);
    this.currentAnimationIndex = this.getCurrentAnimationIndex();
  }

  reset() {
    clearInterval(this.animationInterval);
    this.play();
  }

  fast(speed: any) {
    this.speedMultipliers *= speed;
  }

  slow() {
    this.speedMultipliers = Math.max(1, this.speedMultipliers / 2);
    if (this.animationInterval) {
      const currentIndex = this.getCurrentAnimationIndex();
      this.pause();
      this.resumeFromIndex(currentIndex);
    }
  }

  resumeFromIndex(index: number) {
    clearInterval(this.animationInterval);
    this.animateMarkers(index);
  }

  resume() {
    clearInterval(this.animationInterval);
    this.animateMarkers(this.currentAnimationIndex);
  }

  openConfirmationModal(data = {}) {
    const initialState: ModalOptions = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: {
        ...data,
      },
    };
    this.bsModalRef = this.modalService.show(
      ConfirmationDialogComponent,
      Object.assign(initialState, {
        id: 'confirmationModal',
        class: 'modal-md modal-dialog-centered',
      })
    );
  }

  hideConfirmationModal() {
    this.modalService.hide('confirmationModal');
  }

  selectVehicle(event: any) {
    this.isOverSpeed = true;
    this.timeformate = true;
    this.selectedVehicleId = event;
  }

  timecheck(event: any) {
    this.isOverSpeed = true;
    if (event === "Custom") {
      this.customDate = true;
    } else {
      this.customDate = false;
    }
  }

  getTripReport(formvalue: any,type:any) {    
    if(type === 'history'){
      this.isLoading = true 
    }
    let payload = {
      "DeviceID": [Number(this.selectedVehicleId ? this.selectedVehicleId : formvalue?.deviceId)],
      "FromTime": formatDate(formvalue?.fromDate, 'yyyy-MM-dd HH:mm:ss', 'en-Us'),
      ToTime: formatDate(formvalue?.toDate, 'yyyy-MM-dd HH:mm:ss', 'en-Us'),
      "limit_count": 500,
      "page_num": 1
    };
    this.trackingService.tripReport(payload).subscribe((res: any) => {
      this.isLoading = false
      this.tripReport = res?.body?.Result?.Data;
    });
  }

  togglePlayPause(event: any): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.play();
    } else {
      this.pause();
    }
  }


  getslidervalue(event: any) {
    this.startIndex = event;
    this.sliderValue = event;
    const MIN_DISTANCE_THRESHOLD = 1; 
    this.totalDistance = 0;  // Reset total distance for the calculation

    // Get the current route
    const route = this.wapointmarkerpolylines.getPath();

    // Loop through the path from start to the current slider index to calculate distance
    const currentBus = this.busRoute[this.startIndex];
    const formattedDate = this.datePipe.transform(currentBus.time, 'MMMM dd, yyyy HH:mm:ss');
    
    // Calculate distance only from start to the current slider position
    for (let i = 0; i < this.startIndex; i++) { // Start from 0 to current index
        const currentPosition = route.getAt(i);
        const nextPosition = route.getAt(i + 1);

        if (nextPosition) { // Check if the next position exists
            const distance = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, nextPosition);
            if (distance > MIN_DISTANCE_THRESHOLD) {
                this.totalDistance += distance; // Accumulate total distance
            }
        }
    }

    // Convert total distance to kilometers
    this.totalDistanceKm = this.totalDistance / 1000;
    console.log(this.totalDistanceKm);

    // Update the marker position based on the slider value
    if (this.wapointmarker) {
        this.wapointmarker.setMap(null);
    }

    this.wapointmarker = new google.maps.Marker({
        map: this.map,
        icon: this.carIcon,
        position: this.busRoute[this.startIndex],
        optimized: false
    });
    let lastKnownAddress = 'Address not available';
    const address = {
      Lat: currentBus.lat,
      Lng: currentBus.lng
    };
    this.infoWindow.setContent(this.infoWindowContent(currentBus, formattedDate, 'Loading address...'));
    this.getLiveAddressLocation(address)
      .pipe(
        map((addressValue) => {
          lastKnownAddress = addressValue || 'Address not available'; 
          return this.infoWindowContent(currentBus, formattedDate, lastKnownAddress);
        }),
        catchError(() => {
          lastKnownAddress = 'Address not available'; 
          return of(this.infoWindowContent(currentBus, formattedDate, lastKnownAddress));
        })
      )
      .subscribe((content) => this.infoWindow.setContent(content));

    if (!this.infoWindow.getMap()) {
        this.infoWindow.open(this.map, this.wapointmarker);
    }

    // If animating, ensure that it resumes correctly
    if (this.isPlaying) {
        this.resumeFromIndex(this.startIndex);
    } else {
        this.isPlaying = false;
    }
}

  // animateMarkers(startIndex: any) {
    
  //   const route = this.wapointmarkerpolylines.getPath();
  //   let index = startIndex;
  //   let totalDistance = 0;

  //   if (!this.infoWindow) {
  //     this.infoWindow = new google.maps.InfoWindow();
  //   }

  //   this.animationInterval = setInterval(() => {
  //     const nextPosition = route.getAt(index);
  //     const currentBus = this.busRoute[index];
  //     this.wapointmarker.setPosition(nextPosition);

  //     const previousPosition = route.getAt(index === 0 ? route.getLength() - 1 : index - 1);
  //     const heading = google.maps.geometry.spherical.computeHeading(previousPosition, nextPosition);
  //     const rotation = (heading * Math.PI) / 180;

  //     var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
  //     var icon = {
  //       path: car,
  //       scale: 0.7,
  //       strokeColor: 'white',
  //       strokeWeight: 0.1,
  //       fillOpacity: 1,
  //       fillColor: '#404040',
  //       offset: '5%',
  //       rotation: rotation,
  //       anchor: new google.maps.Point(10, 25),
  //     };
  //     icon.rotation = heading;
  //     this.wapointmarker.setIcon(icon);

  //     const distance = google.maps.geometry.spherical.computeDistanceBetween(previousPosition, nextPosition);
  //     totalDistance += distance;
  //     const totalDistanceKm = totalDistance / 1000;

  //     const date = new Date(currentBus.time);
  //     const formattedDate = `${String(date.getDate()).padStart(2,"0")}/${String(date.getMonth() + 1).padStart(2,'0')}/${date.getFullYear()}`;
  //     const formattedTime = `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,"0")}:${String(date.getSeconds()).padStart(2,"0")}`;
  //     this.startIndex = index;

  //     this.infoWindow.setContent(`
  //       <strong> Speed</strong>: ${currentBus.speed} km/h </br>
  //       <strong> Mileage</strong>: ${totalDistanceKm.toFixed(2)} km </br>
  //       <strong> Time</strong>: ${formattedDate} ${formattedTime} </br>
  //       <strong> Gps</strong>: ${currentBus.lat} - ${currentBus.lng} </br>
  //     `);

  //     if (!this.infoWindow.getMap()) {
  //       this.infoWindow.open(this.map, this.wapointmarker);
  //     }

  //     this.sliderValue = startIndex; // Update slider value

      
  //     this.sliderValueevent.emit(startIndex); // Emit slider value


  //     index = (parseInt(index) + 1) % route.getLength();
  //     const mapBounds = this.map.getBounds();
  //     if (!mapBounds.contains(nextPosition)) {
  //       this.map.panTo(nextPosition);
  //     }
  
      
  //     if (index == 0) {
  //       clearInterval(this.animationInterval);
  //       this.isPlaying = false;
  //     }
  //   }, 1000 / this.speedMultipliers);
  // }
  animateMarkers(startIndex: any) {
    const route = this.wapointmarkerpolylines.getPath();
    let index = startIndex;
    let previousPosition = route.getAt(index);
    const MIN_DISTANCE_THRESHOLD = 1;
    
    let lastKnownAddress = 'Address not available'; // Store the last known address
  
    if (!this.infoWindow) {
      this.infoWindow = new google.maps.InfoWindow();
    }
  
    this.animationInterval = setInterval(() => {
      const nextPosition = route.getAt(index);
      const currentBus = this.busRoute[index];
      this.wapointmarker.setPosition(nextPosition);
  
      // Calculate heading for the arrow rotation
      const heading = google.maps.geometry.spherical.computeHeading(previousPosition, nextPosition);
      const arrowIcon = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 6,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        fillColor: 'blue',
        fillOpacity: 1,
        rotation: heading
      };
      this.wapointmarker.setIcon(arrowIcon);
  
      const distance = google.maps.geometry.spherical.computeDistanceBetween(previousPosition, nextPosition);
  
      if (distance > MIN_DISTANCE_THRESHOLD) {
        this.totalDistance += distance;
        previousPosition = nextPosition;
      }
  
      this.totalDistanceKm = this.totalDistance / 1000;
  
      const formattedDate = this.datePipe.transform(currentBus.time, 'MMMM dd, yyyy HH:mm:ss');
  
      this.startIndex = index;
  
      if (index % 10 === 0) {
        const address = {
          Lat: currentBus.lat,
          Lng: currentBus.lng
        };
        this.infoWindow.setContent(this.infoWindowContent(currentBus, formattedDate, 'Loading address...'));
        this.getLiveAddressLocation(address)
          .pipe(
            map((addressValue) => {
              lastKnownAddress = addressValue || 'Address not available'; 
              return this.infoWindowContent(currentBus, formattedDate, lastKnownAddress);
            }),
            catchError(() => {
              lastKnownAddress = 'Address not available'; 
              return of(this.infoWindowContent(currentBus, formattedDate, lastKnownAddress));
            })
          )
          .subscribe((content) => this.infoWindow.setContent(content));
      } else {
        const content = this.infoWindowContent(currentBus, formattedDate, lastKnownAddress);
        this.infoWindow.setContent(content);
      }
  
      if (!this.infoWindow.getMap()) {
        this.infoWindow.open(this.map, this.wapointmarker);
      }
  
      this.sliderValue = startIndex;
      this.sliderValueevent.emit(startIndex);
  
      index = (parseInt(index) + 1) % route.getLength();
  
      const mapBounds = this.map.getBounds();
      if (!mapBounds.contains(nextPosition)) {
        this.map.panTo(nextPosition);
      }
  
      if (index === 0) {
        clearInterval(this.animationInterval);
        this.isPlaying = false;
      }
    }, 1000 / this.speedMultipliers);
  }
  
  
  
  infoWindowContent (currentBus:any, formattedDate :any, address:any) {
    return `<div class="row mb-2">
                <div class="col-md-12">
                    <span style="font-size:16px"><strong>${this.historyData?.Vehicle?.VehicleNo}</strong></span>
                </div>        
            </div>
            <div class="row mb-2">
                <div class="col-md-6">
                    <span><strong>Speed: </strong> ${currentBus.speed} km/h </span>
                </div>
                <div class="col-md-6">
                    <span><strong>Mileage: </strong> ${this.totalDistanceKm.toFixed(2)} km</span>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-md-12">
                    <span> <strong>Date: </strong> ${formattedDate}</span>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-md-12">
                    <span> <strong>Location: </strong> ${currentBus.lat} - ${currentBus.lng} </span>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-md-12">
                    <span> <strong>Address: </strong> ${address} </span>
                </div>
            </div>`
  }

  getCurrentAnimationIndex(): number {
    const route = this.wapointmarkerpolylines.getPath();
    const totalPoints = route?.getLength();

    const currentLatLng = this.wapointmarker?.getPosition();
    if (!currentLatLng) return 0;

    for (let i = 0; i < totalPoints; i++) {
      const point = route.getAt(i);
      if (google.maps.geometry.spherical.computeDistanceBetween(currentLatLng, point) < 1) {
        return i;
      }
    }
    return 0;
  }

  hidestop() {
    this.isHide = !this.isHide;
    if (this.isHide === false) {
      this.clearStoppageMarkers();
    } else {
      this.addStoppage();
    }
  }
  
  changespeed(event: any) {
    this.speedMultipliers = event;

    if (this.isPlaying) {
      if (this.infoWindow) {
        this.infoWindow.close();
      }
      this.pause();
      this.resume();
    }
  }
  handleAddressSelection(addresses: any): void {
    this.selectTrip = addresses
    if(addresses) {
     this.tripValue = {
      "deviceId" :this.selectedVehicleId,
      "FromTime":  this.datePipe.transform(addresses?.trip?.StartTime, 'yyyy-MM-dd HH:mm:ss'),
      "toTime": this.datePipe.transform(addresses?.trip?.EndTime, 'yyyy-MM-dd HH:mm:ss'),
      }
      
      this.submit('trip')
    }
    
    this.clearMap();
  
   
  }

  clickedMarker: google.maps.Marker | null = null;
  clickedInfoWindow: google.maps.InfoWindow | null = null;
  
  addMarker(lat: any, lng: any, title: string, isStart: boolean, isEnd: boolean): void {    
    let label = '';
    if (isStart) {
      label = '';  
    } else if (isEnd) {
      label = 'E'; 
    }

    let iconUrl = '';
    if (isStart) {
      iconUrl = 'assets/images/marker.png';  // Provide the URL to your start icon
    } else if (isEnd) {
      iconUrl = 'assets/images/flag.png';  // Provide the URL to your end icon
    }
  
    const position = new google.maps.LatLng(lat, lng);
    const marker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: title,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(40, 40), // Adjust the size of your icon
      }
    });
    
    let infoWindow: google.maps.InfoWindow | any
      marker.addListener('click', () => {
        const address = {
          Lat:lat,
          Lng: lng
        };
        this.clickedMarker = marker;
      this.clickedInfoWindow = infoWindow;
    
    
        const initialContent = this.generateInfoWindowContent('Address is Loading...');
        infoWindow = new google.maps.InfoWindow({
         content: `<div style="font-size: 14px;">${initialContent}</div>`
        });
        infoWindow.open(this.map, marker);
    
        this.getLiveAddressLocation(address).pipe(
          map(addressValue => this.generateInfoWindowContent( addressValue || 'Address not available')),
          catchError(() => of(this.generateInfoWindowContent( 'Address not available')))
        ).subscribe(content => infoWindow.setContent(content));
      });
    
  
    this.markers.push(marker);
    this.map.setCenter(position);
    this.map.setZoom(11)
  }

  generateInfoWindowContent(address: string): string {
    return `<div style="font-size: 14px;">${address}</div>`
  }
  
  
  
  clearMap(): void {
    if (this.markers) {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
    }
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
  }

  getLiveAddressLocation(address: any): Observable<any> {
    return this.commonService.getAddressValue(address).pipe(
      map((res: any) => res)
    );
  }
}
