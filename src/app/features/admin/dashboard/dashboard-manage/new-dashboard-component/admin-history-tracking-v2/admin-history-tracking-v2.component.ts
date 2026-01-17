import { DatePipe, formatDate, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { DashboardService } from 'src/app/features/users/dashboard/dashboard-summary/services/dashboard.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmationDialogComponent } from 'src/app/features/shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserService } from 'src/app/features/shared/user/services/user.service';
import { catchError, map, Observable, of } from 'rxjs';
import { CommonService } from 'src/app/features/shared/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { TrackingService } from 'src/app/features/users/tracking/manage-tracking/services/tracking.service';
import { AdminDashboardService } from '../../services/admin-dashboard.service';


@Component({
  selector: 'app-admin-history-tracking-v2',
  templateUrl: './admin-history-tracking-v2.component.html',
  styleUrls: ['./admin-history-tracking-v2.component.scss']
})
export class AdminHistoryTrackingV2Component {
  map: L.Map | any;
  polyline: L.Polyline | null = null;
  animatedMarker: L.Marker | any = null;
  vehicleData: any[] = [];
  selectedVehicleId: any;
  isOverSpeed: boolean = false;
  filterSelectId: any;
  timeformate: boolean = false;
  historyForm!: FormGroup
  tripReport: any;
  isLoading: boolean = false;
  currentIndex: number = 0;
  isPlaying: boolean = false;
  selectedSpeed: number = 1;
  timeoutId: any;
  startMarker: L.Marker | null = null;
  endMarker: L.Marker | null = null;
  sliderValue: number = 0;
  maxValue: number = 100;
  customDate: boolean = false;
  private moveInterval = 1000;
  private stepsInSegment = 50;
  overSpeedvalue: any;
  historylist: any;
  historyData: any;
  topSpeed: any = 0;
  tripType: boolean = false;
  bsModalRef!: BsModalRef;
  totaldistanceValue: any = 0;
  selectTrip: any;
  tripValue: any;
  waypointPolyline: L.Polyline | any;
  spinnerLoading: boolean = false // Declare waypointPolyline as a class-level variable



  selectDate = [
    { id: 1, dateValue: 'Today' },
    { id: 2, dateValue: 'Yesterday' },
    { id: 3, dateValue: 'Weekly' },
    { id: 6, dateValue: 'Custom' }
  ];
  speed = [
    { id: 1, value: '1x' },
    { id: 2, value: '2x' },
    { id: 4, value: '3x' },
    { id: 16, value: '4x' },
    { id: 32, value: '5x' }
  ]
  totalDistance = 0;
  selectedCustomer: any;



  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dashbaordService: DashboardService,
    private fb: FormBuilder,
    private trackingService: TrackingService,
    private modalService: BsModalService,
    private userService: UserService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private activeroute: ActivatedRoute,
    private dashboardService: AdminDashboardService,



  ) { }

  ngOnInit(): void {
    this.setInitialValue();
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
    }
    this.selectedVehicleId = this.activeroute.snapshot.paramMap.get("id");
    if (this.selectedVehicleId) {
      this.getAllVehicleData();
    }
  }


  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    if (this.animatedMarker) {
      this.map.removeLayer(this.animatedMarker)
      this.animatedMarker = null
    }
  }

  async initializeMap(): Promise<void> {
    const leafletModule = await import('leaflet');
    this.map = L.map('admin_map_canvas', {
      center: [20.29573, 85.82476],
      zoom: 5,
      zoomControl: false,
    });

    const osmLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 21,
      }
    );

    const satelliteLayer = L.tileLayer(
      'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
      {
        attribution: 'Imagery © <a href="http://maps.google.com">Google</a>',
        maxZoom: 21,
      }
    );

    const googleLayer = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        maxZoom: 21,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps',
      }
    ).addTo(this.map);

    // Esri Terrain and OpenTopoMap as alternatives to Stamen Terrain


    const baseMaps = {
      'Google Map': googleLayer,
      OpenStreetMap: osmLayer,
      Satellite: satelliteLayer,
    };

    L.control.layers(baseMaps).addTo(this.map);
    L.control.zoom({
      position: 'topleft'
    }).addTo(this.map);
  }

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

  getAllVehicleData() {
    this.dashboardService.vehicleList().subscribe({
      next: (res: any) => {
        // Handle different response structures
        let rawData: any[] = [];
        
        // Check for different response formats
        if (res?.body?.Result?.Data) {
          rawData = Array.isArray(res.body.Result.Data) ? res.body.Result.Data : [res.body.Result.Data];
        } else if (res?.body?.result === true && res?.body?.data) {
          rawData = Array.isArray(res.body.data) ? res.body.data : [res.body.data];
        } else if (res?.body?.Data) {
          rawData = Array.isArray(res.body.Data) ? res.body.Data : [res.body.Data];
        } else if (Array.isArray(res?.body)) {
          rawData = res.body;
        } else if (res?.body?.data && Array.isArray(res.body.data)) {
          rawData = res.body.data;
        } else if (Array.isArray(res?.data)) {
          rawData = res.data;
        } else {
          rawData = [];
        }
        
        // Transform data to match expected structure (Device.Id, Device.VehicleNo)
        this.vehicleData = rawData.map((item: any) => {
          // If already in old format (has Device object), return as is
          if (item?.Device?.Id) {
            return item;
          }
          
          // Transform new format to old format
          return {
            Device: {
              Id: item?.device?.id || item?.deviceId || item?.Id || item?.id || 0,
              VehicleNo: item?.device?.vehicleNo || item?.vehicleNo || item?.VehicleNo || item?.device?.vehicleNumber || '',
              DeviceImei: item?.device?.deviceImei || item?.deviceImei || item?.DeviceImei || '',
              VehicleType: item?.device?.vehicleType || item?.vehicleType || item?.VehicleType || 0
            },
            _original: item
          };
        }).filter((item: any) => item?.Device?.Id && item?.Device?.Id > 0); // Filter out invalid items
        
        if (this.selectedVehicleId && this.vehicleData && this.vehicleData.length > 0) {
          this.isOverSpeed = true;
          // Find the vehicle matching the selected device ID
          let selectedVehicle = this.vehicleData.find((ele: any) => {
            const deviceId = ele?.Device?.Id || ele?.deviceId || ele?.Id;
            return deviceId == this.selectedVehicleId || deviceId == Number(this.selectedVehicleId);
          });
          
          if (selectedVehicle) {
            const vehicleNo = selectedVehicle?.Device?.VehicleNo || selectedVehicle?.vehicleNo || selectedVehicle?.VehicleNo;
            const deviceId = selectedVehicle?.Device?.Id || selectedVehicle?.deviceId || selectedVehicle?.Id;
            
            this.filterSelectId = vehicleNo;
            this.timeformate = true;
            // Set the device ID value in the form (dropdown uses device ID as value)
            this.historyForm.controls['deviceId'].patchValue(deviceId);
          } else {
            // If vehicle not found in list, still set the selectedVehicleId in form
            this.isOverSpeed = true;
            this.timeformate = true;
            this.historyForm.controls['deviceId'].patchValue(Number(this.selectedVehicleId));
          }
        }
      },
      error: (error: any) => {
        console.error('Error loading vehicle data:', error);
        this.vehicleData = [];
      }
    });
  }

  timecheck(event: any) {
    this.isOverSpeed = true;
    if (event === "Custom") {
      this.customDate = true;
    } else {
      this.customDate = false;
    }
  }

  selectVehicle(event: any) {
    this.isOverSpeed = true;
    this.timeformate = true;
    this.selectedVehicleId = event;
  }

  getTripReport(formvalue: any, type: any) {
    if (type === 'history') {
      this.isLoading = true
    }
    let payload = {
      "DeviceID": [Number(this.selectedVehicleId ? this.selectedVehicleId : formvalue?.deviceId)],
      "FromTime": formatDate(formvalue?.fromDate, 'yyyy-MM-dd HH:mm:ss', 'en-Us'),
      "ToTime": formatDate(formvalue?.toDate, 'yyyy-MM-dd HH:mm:ss', 'en-Us'),
      "limit_count": 500,
      "page_num": 1
    };
    this.trackingService.tripReport(payload).subscribe((res: any) => {
      this.isLoading = false
      this.tripReport = res?.body?.Result?.Data;
      console.log("check trip", this.tripReport);

    });
  }

  submit(type: any, formvalue?: any) {
    this.spinnerLoading = true;
    this.clearMap();
    let payload: any;
    if (type === 'history') {
      this.tripReport = [];
      this.tripType = false
      this.isLoading = true
      const deviceId = this.selectedVehicleId ? this.selectedVehicleId : formvalue?.deviceId;
      const fromDate = new Date(formvalue?.fromDate);
      const toDate = new Date(formvalue?.toDate);
      
      // Format dates to ISO string with timezone (e.g., "2026-01-11T00:00:00+05:30")
      const fromTimeISO = this.formatDateToISOWithTimezone(fromDate);
      const toTimeISO = this.formatDateToISOWithTimezone(toDate);
      
      payload = {
        "DeviceId": String(deviceId),
        "FromTime": fromTimeISO,
        "ToTime": toTimeISO
      };
    } else {
      payload = this.tripValue
    }
    this.dashboardService.adminLivetrackinghistory(payload).subscribe((res: any) => {
      this.spinnerLoading = false;
      this.isLoading = false
      
      // Handle HttpResponse wrapper (res.body) or direct response (res)
      const responseBody = res?.body || res;
      
      // Map the new API response structure - check for data in body or directly
      const apiData = responseBody?.data || responseBody?.Data;
      
      if (!apiData || (Array.isArray(apiData) && apiData.length === 0)) {
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
        // Map the response data to match expected structure
        const responseData = Array.isArray(apiData) ? apiData : [apiData];
        
        // Map each item to the expected format
        this.historylist = responseData.map((item: any) => ({
          Latitude: item.latitude,
          Longitude: item.longitude,
          Speed: item.speed,
          Timestamp: item.timestamp,
          Heading: item.heading,
          vehicleNo: item.vehicleNo
        }));
        
        // Set historyData with vehicle info
        if (responseData.length > 0) {
          this.historyData = {
            Vehicle: {
              VehicleNo: responseData[0].vehicleNo || 'N/A'
            }
          };
        }
        
        if (type == 'trip') {
          this.totaldistanceValue = this.selectTrip?.distance || 0;
        } else {
          // Calculate total distance from history data if available
          this.totaldistanceValue = this.calculateTotalDistance(this.historylist) || 0;
          this.getTripReport(formvalue, 'history');
        }

        this.userService.historycount(this.historylist.length);
        this.updatePolyline();
      }
    });
  }

  formatDateToISOWithTimezone(date: Date): string {
    // Get timezone offset in minutes and convert to HH:MM format
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
    const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    const timezone = `${sign}${hours}:${minutes}`;
    
    // Format date to ISO string and replace Z with timezone
    return date.toISOString().replace('Z', timezone);
  }

  calculateTotalDistance(historyList: any[]): number {
    if (!historyList || historyList.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < historyList.length; i++) {
      const prev = historyList[i - 1];
      const curr = historyList[i];
      const distance = this.calculateDistance(
        prev.Latitude, prev.Longitude,
        curr.Latitude, curr.Longitude
      );
      totalDistance += distance;
    }
    return totalDistance / 1000; // Convert meters to kilometers
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
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

  clearMap() {
    this.currentIndex = 0;
    this.sliderValue = 0;
    this.isPlaying = false;
    this.selectedSpeed = 1;
    this.moveInterval = 1000;
    this.totaldistanceValue = 0;
    this.topSpeed = 0;
    this.historylist = [];

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }
    if (this.startMarker) {
      this.map.removeLayer(this.startMarker);
    }
    if (this.endMarker) {
      this.map.removeLayer(this.endMarker);
    }
    if (this.animatedMarker) {
      this.map.removeLayer(this.animatedMarker);
      this.animatedMarker = null;
    }

    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }

    this.initializeMap().then(() => {
      console.log('Map has been reset and reinitialized.');
    });
  }

  updatePolyline() {
    const path = this.historylist.map((bus: any) => [bus.Latitude, bus.Longitude]);
    this.topSpeed = Math.max(...this.historylist.map((item: any) => item.Speed));

    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }
    if (this.startMarker) {
      this.map.removeLayer(this.startMarker);
    }
    if (this.endMarker) {
      this.map.removeLayer(this.endMarker);
    }

    this.polyline = L.polyline(path, {
      color: 'blue',
      weight: 2,
      opacity: 2.0,
    }).addTo(this.map);

    const firstLocation = path[0];
    if (firstLocation) {
      const markerIcon = L.divIcon({
        className: 'marker',
        html: '<div style="font-size: 24px;color: green"><i class="fa fa-location-dot"></i></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      this.startMarker = L.marker(firstLocation, { icon: markerIcon }).addTo(this.map);
    }

    const lastLocation = path[path.length - 1];
    if (lastLocation) {
      const flagIcon = L.divIcon({
        className: 'flag-icon',
        html: '<div style="font-size: 24px;color: red"><i class="fa fa-flag-o"></i></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      this.endMarker = L.marker(lastLocation, { icon: flagIcon }).addTo(this.map);
    }

    this.map.setView(firstLocation, 13);
  }

  handleAddressSelection(addresses: any): void {
    this.selectTrip = addresses;

    if (addresses) {
      this.tripValue = {
        "deviceId": this.selectedVehicleId,
        "FromTime": this.datePipe.transform(addresses?.trip?.StartTime, 'yyyy-MM-dd HH:mm:ss'),
        "toTime": this.datePipe.transform(addresses?.trip?.EndTime, 'yyyy-MM-dd HH:mm:ss'),
      }

      this.submit('trip')
    }
    this.clearMap();
  }


  play() {
    this.animateMarker(this.currentIndex);
  }

  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  getLiveAddressLocation(address: any): Observable<any> {
    return this.commonService.getAddressInfoDetail(address).pipe(map((res: any) => res));
  }
  routeCoordinates: any[] = [];

  animateMarker(startIndex: number) {
    const path = this.historylist.map((bus: any) => [bus.Latitude, bus.Longitude]);
    this.routeCoordinates = path;

    if (path.length === 0) return;

    if (!this.animatedMarker) {
      this.animatedMarker = L.marker(path[startIndex]).addTo(this.map);
    }

    let popupOpened = true;
    const canvas = document.createElement('canvas');
    const context: any = canvas.getContext('2d');
    const img = new Image();

    let currentIndex = startIndex;
    const steps = path.length - 1;

    const animateStep = () => {
      if (currentIndex < path.length - 1) {
        const start = path[currentIndex];
        const end = path[currentIndex + 1];

        const deltaLat = end[0] - start[0];
        const deltaLng = end[1] - start[1];
        const heading = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);

        img.src = this.onCheckVehicleDevice();
        img.onload = () => {
          const canvasWidth = Math.max(img.width, img.height);
          const canvasHeight = canvasWidth;

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          context.clearRect(0, 0, canvasWidth, canvasHeight);
          context.translate(canvasWidth / 2, canvasHeight / 2);
          context.rotate((heading * Math.PI) / 180);
          context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
          context.rotate(-(heading * Math.PI) / 180);
          context.translate(-canvasWidth / 2, -canvasHeight / 2);

          const iconDataUrl = canvas.toDataURL();
          const icon = L.icon({
            iconUrl: iconDataUrl,
            iconSize: [30, 30],
          });

          let stepIndex = 0;
          const moveMarker = () => {
            if (stepIndex <= this.stepsInSegment) {
              const lat = start[0] + (end[0] - start[0]) * (stepIndex / this.stepsInSegment);
              const lng = start[1] + (end[1] - start[1]) * (stepIndex / this.stepsInSegment);
              this.animatedMarker.setLatLng([lat, lng]);
              this.animatedMarker.setIcon(icon);

              if (stepIndex === 0 && popupOpened) {
                const address = { Lat: lat, Lng: lng };
                this.animatedMarker
                  .bindPopup(this.generateInfoWindowContent(this.historylist[currentIndex], 'Address is Loading...'))
                  .openPopup();

                this.getLiveAddressLocation(address)
                  .pipe(
                    map((addressValue) =>
                      this.generateInfoWindowContent(
                        this.historylist[currentIndex],
                        addressValue || 'Address not available'
                      )
                    ),
                    catchError(() =>
                      of(this.generateInfoWindowContent(this.historylist[currentIndex], 'Address not available'))
                    )
                  )
                  .subscribe((content) => this.animatedMarker.getPopup().setContent(content));
              }

              this.map.setView([lat, lng], this.map.getZoom(), { animate: true });
              this.sliderValue = currentIndex;
              stepIndex++;
              this.timeoutId = setTimeout(moveMarker, this.moveInterval / this.stepsInSegment);
            } else {
              currentIndex++;
              this.currentIndex = currentIndex;

              if (currentIndex === steps) {
                this.sliderValue = currentIndex;
                this.isPlaying = false;
              }
              animateStep();
            }
          };

          moveMarker();
        };

        img.onerror = () => {
          console.error('Error loading image for animated marker icon.');
        };

        this.animatedMarker.on('popupclose', () => {
          popupOpened = false;
        });

        this.animatedMarker.on('click', () => {
          if (!popupOpened) {
            this.animatedMarker.openPopup();
            popupOpened = true;
          } else {
            this.animatedMarker
              .getPopup().setContent(this.generateInfoWindowContent(this.historylist[currentIndex], 'Address is Loading...'))
          }
        });
      } else {
        this.timeoutId = null;
      }
    };

    animateStep();
  }


  formatDateValue(date: any) {
    return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss')
  }

  changeSpeed(event: any) {
    const speedValue = Number(event.target.value);
    this.selectedSpeed = 1 * speedValue;
    this.moveInterval = 1000 / this.selectedSpeed;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.animateMarker(this.currentIndex);
    }
  }

  onCheckVehicleDevice() {
    return 'assets/images/arrow.png';
  }


  togglePlayPause(event: any): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      if (this.currentIndex >= this.historylist.length - 1) {
        this.currentIndex = 0;
      }
      this.play();
    } else {
      this.pause();
    }
  }

  sliderChange(event: any) {
    this.sliderValue = 0
    this.sliderValue = Number(event.target.value);
    this.getslidervalue(this.sliderValue)
  }

  getslidervalue(event: any) {
    this.currentIndex = event;
    this.sliderValue = event;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      if (this.currentIndex >= this.historylist.length - 1) {
        this.currentIndex = 0;
      }
      this.animateMarker(this.currentIndex);
    }
  }


  generateInfoWindowContent(data: any, address: string) {
    const truncateLongWords = (text: string, maxLength: number) => {
      return text
        .split(' ')
        .map((word) => (word.length > maxLength ? word.substring(0, maxLength) + '...' : word))
        .join(' ');
    };

    const truncatedWordsContent = truncateLongWords(address, 20);
    const processedAddress = truncatedWordsContent.length > 80
      ? truncatedWordsContent.substring(0, 80) + '...'
      : truncatedWordsContent;

    return `
                      <div class="">
                        <div class="live-data pl-2 mt-1">
                          <div class="row mb-2">
                            <div class="col-md-6">
                              <span style="font-size:16px"><strong>${this.historyData?.Vehicle?.VehicleNo ?? 'NA'
      }</strong></span>
                            </div>
                             <div class="col-md-6">
                          <span><strong>speed:</strong> ${data.Speed} Km/h</span>          
                          </div>
                          </div>
                        <div class="row mb-2">
                          <div class="col-md-12">
                          <span> <strong>Date:</strong> ${this.formatDateValue(data.Timestamp)}
                          </div>
                         
                        </div>
                        <div class="row mb-2">
                          <div class="col-md-12 location-part">
                            <span style="color: black" class="address"><strong>Location:</strong> ${processedAddress}
                </span>
                        </div>
                      </div>`;
  }
}
