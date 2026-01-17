import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import * as L from 'leaflet';
import { catchError, EMPTY, filter, from, interval, map, Observable, of, Subject, Subscription, switchMap, take, takeUntil, tap, timer } from 'rxjs';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { CommonService } from 'src/app/features/shared/services/common.service';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'vehicle-on-map-v2',
  templateUrl: './vehicle-on-map-v2.component.html',
  styleUrls: ['./vehicle-on-map-v2.component.scss']
})
export class VehicleOnMapV2Component {
  map: L.Map | any;
  counter: number = 10;
  liveData: any;
  vehicleListshow: boolean = true;
  vehicleData: any;
  vehicleDatacount: any;
  liveTime: boolean = false;
  swiperData: any;
  spinnerLoading: boolean = false;
  subscription: Subscription | any;
  private unsubscribe$ = new Subject<void>();
  countdown: number | undefined;
  counterInterval: any = null;
  data: any;
  selectedStatus: any;
  confirmedVehicleId: string | null = null;
  private markers: L.Marker[] = [];
  private infoVehicleWindows: L.Popup[] = [];
  private clickedMarker: L.Marker | any = null;
  animationRequest: any;
  polyline: L.Polyline | null = null;
  selectType: boolean = false;
  selectedCustomer: any;
  isInfoShow: boolean = true;
  private unsubscribeRouteChange$ = new Subject<void>();
  vehilceOnMapdata: any;
  livemap: any[] = [];
  userDetail: any;
  dayDistanceValue: any;
  selectedVehicleValue: any;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    private storageService: StorageService,
    private router: Router,
    private datePipe: DatePipe,

  ) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeRouteChange$)
    ).subscribe((event: any) => {
      this.unsubscribe();
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
    }
  }

  ngOnDestroy() {
    this.unsubscribeRouteChange$.next();
    this.unsubscribeRouteChange$.complete();
    this.subscription?.unsubscribe();
  }

  async initializeMap(): Promise<void> {
    const leafletModule = await import('leaflet');
    const L = leafletModule.default;
    this.map = L.map('admin_canvas', {
      center: [28.6139, 77.2088],
      zoom: 6,
      zoomControl: false,
    });

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 21
    });

    const satelliteLayer = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
      attribution: 'Imagery © <a href="http://maps.google.com">Google</a>',
      maxZoom: 21
    });

    const googleLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 21,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }).addTo(this.map);
    const baseMaps = {
      "Google Map": googleLayer,
      "OpenStreetMap": osmLayer,
      "Satellite": satelliteLayer
    };

    L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(this.map);
    L.control
    .zoom({
      position: 'topright',
    })
    .addTo(this.map);

    // Initialize vehicle data after map is ready
    // New API doesn't require customer selection - fetch all vehicles
    this.storageService.setItem('status', 'All');
    this.getVehicleData();
  }


  getVehicleData(id?: any) {
    // New API doesn't require customer ID - fetches all vehicles
    this.swiperData = [];
    this.spinnerLoading = true;
    this.subscription?.unsubscribe();
    this.unsubscribe$ = new Subject();

    this.subscription = timer(0, 10000).pipe(
      tap(value => {
        this.countdown = value % 10 === 0 ? 0 : 10 - (value % 10);
        this.counter = 10;
        clearInterval(this.counterInterval);
        this.counterInterval = setInterval(() => {
          this.counter--;
        }, 1000);
      }),
      switchMap(() => this.dashboardService.vehicleList()),
      tap((res: any) => {
        this.spinnerLoading = false;
        // Transform new API response to old structure format
        // API response: { result: true, data: [...] } or direct array
        let rawData: any[] = [];
        if (res?.body?.result === true && res?.body?.data) {
          rawData = Array.isArray(res.body.data) ? res.body.data : [res.body.data];
        } else if (Array.isArray(res?.body)) {
          rawData = res.body;
        } else if (res?.body?.data && Array.isArray(res.body.data)) {
          rawData = res.body.data;
        }
        this.data = this.transformVehicleData(rawData);
        this.vehicleDatacount = this.data;
        this.sendFilteredData();
      }),
      switchMap(() => this.storageService.getItem('status')),
      tap((status: any) => {
        this.selectedStatus = status;
        this.filterout(this.data);
        this.plotVehicleonMap();
      })
    ).subscribe(
      () => { },
      (error) => {
        console.error('Error fetching vehicle data:', error);
        this.spinnerLoading = false;
      }
    );

    localStorage.setItem('isPageRefreshed', 'true');
  }

  // Transform new API response structure to old format for compatibility
  transformVehicleData(newData: any[]): any[] {
    return newData.map((item: any) => {
      const statusStr = item?.position?.status?.status || 'offline';
      const statusMap: any = {
        'running': { Status: 1, SubStatus: 1 },
        'stop': { Status: 1, SubStatus: 2 },
        'dormant': { Status: 1, SubStatus: 3 },
        'offline': { Status: 0, SubStatus: 0 },
        'never connected': { Status: 0, SubStatus: 0 },
        'point expired': { Status: 0, SubStatus: 0 }
      };
      const statusInfo = statusMap[statusStr.toLowerCase()] || { Status: 0, SubStatus: 0 };

      // Check validity for expired status
      let isExpired = false;
      let isExpiredSoon = false;
      if (item?.validity) {
        const nextRecharge = new Date(item.validity.nextRechargeDate);
        const today = new Date();
        const daysDiff = Math.ceil((nextRecharge.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff < 0) {
          isExpired = true;
        } else if (daysDiff <= 7) {
          isExpiredSoon = true;
        }
      }

      // Check if never connected (no position data or invalid position)
      const neverConnected = !item?.position || !item?.position?.latitude || !item?.position?.longitude || item?.position?.valid !== 1;

      return {
        Device: {
          VehicleNo: item?.device?.vehicleNo || '',
          DeviceImei: item?.device?.deviceImei || item?.device?.deviceId || '',
          VehicleType: item?.device?.vehicleType || 0,
          Id: item?.device?.id || 0,
          SoftOdometer: item?.device?.details?.lastOdometer || 0
        },
        Eventdata: {
          Latitude: item?.position?.latitude || 0,
          Longitude: item?.position?.longitude || 0,
          Speed: item?.position?.speed || 0,
          Heading: item?.position?.heading || 0,
          GpsTimestamp: item?.position?.deviceTime || item?.position?.servertime || new Date().toISOString(),
          GpsStatus: item?.position?.valid === 1 ? 1 : 0,
          EPC: item?.position?.details?.extVolt || 0
        },
        Status: statusInfo.Status,
        SubStatus: statusInfo.SubStatus,
        StatusDuration: item?.position?.status?.duration || '',
        isexpired: isExpired ? 1 : 0,
        isexpiredsoon: isExpiredSoon ? 1 : 0,
        neverConnected: neverConnected,
        // Map peripherial data if available
        Peripherial: {
          AC: item?.position?.details?.in1 === 1 ? 1 : 0,
          Door: item?.position?.details?.door === true ? 1 : 0,
          Temp: item?.position?.details?.temp || 0,
          ACC: item?.position?.details?.ign === true ? 1 : 0
        },
        Battery: {
          status: item?.position?.details?.bmsSOC ? `${item.position.details.bmsSOC.toFixed(1)}%` : null,
          color: item?.position?.details?.bmsSOC && item.position.details.bmsSOC > 20 ? 'green' : 'red'
        },
        // Keep original data for reference
        _original: item
      };
    });
  }

  filterout(data: any): Observable<any> {
    if (this.selectedStatus === 'Offline') {
      this.vehicleData = data.filter((res: any) => {
        const status = res?._original?.position?.status?.status?.toLowerCase() || 'offline';
        return status === 'offline' || res?.Status == 0;
      });
    } else if (this.selectedStatus === 'Running') {
      this.vehicleData = data.filter((res: any) => {
        const status = res?._original?.position?.status?.status?.toLowerCase() || '';
        return status === 'running' || (res?.Status == 1 && res?.SubStatus == 1);
      });
    } else if (this.selectedStatus === 'Stop') {
      this.vehicleData = data.filter((res: any) => {
        const status = res?._original?.position?.status?.status?.toLowerCase() || '';
        return status === 'stop' || (res?.Status == 1 && res?.SubStatus == 2);
      });
    } else if (this.selectedStatus === 'Dormant') {
      this.vehicleData = data.filter((res: any) => {
        const status = res?._original?.position?.status?.status?.toLowerCase() || '';
        return status === 'dormant' || (res?.Status == 1 && res?.SubStatus == 3);
      });
    } else if (this.selectedStatus === 'Idle') {
      // Map Idle to Dormant
      this.vehicleData = data.filter((res: any) => {
        const status = res?._original?.position?.status?.status?.toLowerCase() || '';
        return status === 'dormant' || (res?.Status == 1 && res?.SubStatus == 3);
      });
    } else if (this.selectedStatus === 'Never Connected') {
      this.vehicleData = data.filter((res: any) => res?.neverConnected === true);
    } else if (this.selectedStatus === 'Point Expired') {
      this.vehicleData = data.filter((res: any) => res?.isexpired === 1);
    } else if (this.selectedStatus === 'Expired Soon') {
      this.vehicleData = data.filter((res: any) => res?.isexpiredsoon === 1);
    } else if (this.selectedStatus === 'Expired') {
      this.vehicleData = data.filter((res: any) => res?.isexpired === 1);
    } else if (
      this.selectedStatus === 'All' ||
      this.selectedStatus == undefined ||
      this.selectedStatus == null
    ) {
      this.vehicleData = data;
    }
    this.vehilceOnMapdata = this.vehicleData;

    return of(this.vehilceOnMapdata);
  }

  unsubscribe() {
    this.unsubscribe$.next();
  }

  selectCustomer(customer: any) {
    this.clearMarkers();
    if (!customer?.selectcus) {
      this.subscription?.unsubscribe();
    }
    this.selectType = customer?.customer?.type;
    this.unsubscribe();
    this.isInfoShow = false
    this.confirmedVehicleId = null;
    this.liveData = null;
    this.infoVehicleWindows = [];
    this.vehicleListshow = true;
    this.liveTime = false;
    this.vehicleData = [];
    this.data = [];
    this.vehicleDatacount = []
    this.selectedCustomer = customer?.customer?.selectcus;
    if (this.selectedCustomer) {
      this.storageService.setItem('status', 'All')
      this.getVehicleData(); // No parameter needed for new API
    }
  }

  private destroy$ = new Subject<void>();


  plotVehicleonMap() {
    if (this.liveData) {
      return;
    }
    const vehicleObs$ = from(this.vehilceOnMapdata);

    vehicleObs$
      .pipe(
        switchMap((vehicle: any, index: number) => {
          if (!vehicle || (!vehicle?.Eventdata?.Latitude && !vehicle?.Eventdata?.Longitude)) {
            return EMPTY;
          }

          const existingMarkerIndex = this.findExistingMarkerIndex(vehicle.Device.VehicleNo);
          let previousLat: any, previousLon: any;
          if (existingMarkerIndex !== -1) {
            previousLat = this.markers[existingMarkerIndex].getLatLng().lat;
            previousLon = this.markers[existingMarkerIndex].getLatLng().lng;
          }

          const currentLat = vehicle.Eventdata?.Latitude;
          const currentLon = vehicle.Eventdata?.Longitude;

          const deltaLat = currentLat - previousLat;
          const deltaLng = currentLon - previousLon;

          let heading = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);
          const canvas = document.createElement('canvas');
          const context: any = canvas.getContext('2d');
          const img = new Image();
          img.src = this.onCheckVehicleDevice(vehicle);

          return new Promise((resolve) => {
            img.onload = () => {
              const canvasWidth = Math.max(img.width, img.height);
              const canvasHeight = canvasWidth;

              canvas.width = canvasWidth;
              canvas.height = canvasHeight;

              context.clearRect(0, 0, canvasWidth, canvasHeight);
              context.translate(canvasWidth / 2, canvasHeight / 2);
              context.rotate((heading * Math.PI) / 180);
              context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
              context.rotate((-heading * Math.PI) / 180);
              context.translate(-canvasWidth / 2, -canvasHeight / 2);

              const icon = L.icon({
                iconUrl: canvas.toDataURL(),
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              });

              const newPosition = L.latLng(vehicle?.Eventdata?.Latitude, vehicle?.Eventdata?.Longitude);
              resolve({ vehicle, icon, newPosition, existingMarkerIndex });
            };
          }).then((data: any) => {
            const { vehicle, icon, newPosition, existingMarkerIndex } = data;
            if (existingMarkerIndex !== -1) {
              this.markers[existingMarkerIndex].setIcon(icon);
              this.markers[existingMarkerIndex].setLatLng(newPosition);

              const popup = this.infoVehicleWindows[existingMarkerIndex];
              if (popup && this.clickedMarker === this.markers[existingMarkerIndex]) {
                const clickedMarkerTooltip = this.clickedMarker.getTooltip();
                const clickedMarkerText = clickedMarkerTooltip.getContent();
                const vehicleInfo = this.vehilceOnMapdata.find((vehicle: any) => vehicle?.Device?.VehicleNo === clickedMarkerText);

                if (vehicleInfo) {
                  const address = {
                    Lat: vehicleInfo?.Eventdata?.Latitude,
                    Lng: vehicleInfo?.Eventdata?.Longitude
                  };

                  const initialContent = this.generateInfoWindowContent(
                    vehicle,
                    'Address is Loading...',
                  );
                  popup.setContent(initialContent).setLatLng(newPosition);

                  this.getLiveAddressLocation(address)
                    .pipe(
                      map((addressValue) =>
                        this.generateInfoWindowContent(
                          vehicle,
                          addressValue || 'Address not available',
                        )
                      ),
                      catchError(() =>
                        of(this.generateInfoWindowContent(vehicle, 'Address not available',
                        ))
                      )
                    )
                    .subscribe((content) => popup.setContent(content));
                  if (this.clickedMarker === this.markers[existingMarkerIndex] && !this.clickedMarker.popupManuallyClosed) {
                    popup.openOn(this.map);
                  }
                }
              }

            } else {
              const popup = L.popup();
              this.createMarker(vehicle, index, icon, popup);
              this.infoVehicleWindows.push(popup);
            }
            return Promise.resolve();
          });
        }),
        switchMap(() => interval(10000).pipe(takeUntil(this.destroy$))),
        take(1)
      )
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  createMarker(vehicle: any, index: number, icon: any, popup: L.Popup) {
    const newPosition = L.latLng(
      vehicle?.Eventdata?.Latitude,
      vehicle?.Eventdata?.Longitude
    );

    const address = {
      Lat: vehicle?.Eventdata?.Latitude,
      Lng: vehicle?.Eventdata?.Longitude,
    };
    const marker: any = L.marker(newPosition, {
      icon: icon,
    }).addTo(this.map);

    marker.bindTooltip(`${vehicle?.Device?.VehicleNo}`, {
      direction: 'bottom',
      className: 'map-label',
      permanent: true,
    });

    marker.popupManuallyClosed = false;

    popup.on('close', () => {
      marker.popupManuallyClosed = true;
    });

    marker.on('click', () => {
      if (marker.popupManuallyClosed) {
        marker.openPopup();
        marker.popupManuallyClosed = false;
      }
      this.clickedMarker = marker;

      const initialContent = this.generateInfoWindowContent(vehicle, 'Address is Loading...');

      popup.setContent(initialContent).setLatLng(newPosition).openOn(this.map);

      this.getLiveAddressLocation(address)
        .pipe(
          map((addressValue) =>
            this.generateInfoWindowContent(
              vehicle,
              addressValue || 'Address not available')
          ),
          catchError(() =>
            of(this.generateInfoWindowContent(vehicle, 'Address not available'))
          )
        )
        .subscribe((content) => popup.setContent(content));
    });
    this.addPopupListeners(popup, vehicle);

    this.markers.push(marker);
    // this.map.setView(newPosition);
    const bounds = L.latLngBounds(this.markers.map((m) => m.getLatLng()));
    this.map.fitBounds(bounds);
  }

  addPopupListeners(popup: any, vehicle: any) {
    popup.on('contentupdate', () => {
      const playLink = document.getElementById('adminPlayId');
      const replayLink = document.getElementById('adminReplayId');
      const geoButton = document.getElementById('geofanceId')

      if (playLink) {
        playLink.addEventListener('click', (event) => this.handlePlayClickData(event, vehicle));
      }
      if (replayLink) {
        replayLink.addEventListener('click', (event) => this.handleRePlayClick(event, vehicle));
      }

      // if (geoButton) {
      //   geoButton.addEventListener('click', (event) => this.handleGeofanceClick(event, vehicle));
      // }
    });
  }


  findExistingMarkerIndex(vehicleNo: string): any {
    return this.markers.findIndex(
      (marker: any) => marker.getTooltip()?.getContent() === vehicleNo
    );
  }

  getLiveAddressLocation(address: any): Observable<any> {
    return this.commonService.getAddressInfoDetail(address).pipe(map((res: any) => res));
  }


  generateInfoWindowContent(vehicle: any, address: string) {
    const truncateLongWords = (text: string, maxLength: number) => {
      return text
        .split(' ')
        .map((word) => {
          return word.length > maxLength
            ? word.substring(0, maxLength) + '...'
            : word;
        })
        .join(' ');
    };
    const generateIcon = (icon: string, label: string, status: number, noData = false) => {
      if (icon === 'fa-key') {
        if (status === null || status === 0) {
          return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
        }
        if (status === 1) {
          return `<li><a><i class="fa ${icon}" style="color:green !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
        }
      }
      if (noData) {
        return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
      }
      if (status === 0) {
        return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
      }
      if (status === 1) {
        return `<li><a><i class="fa ${icon}" style="color:green !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
      }
      return '';
    };

    const truncatedWordsContent = truncateLongWords(address, 20);
    const processedAddress =
      truncatedWordsContent.length > 80
        ? truncatedWordsContent.substring(0, 80) + '...'
        : truncatedWordsContent;
    return `
      <div class="">
        <div class="">
          <div class="live-data pl-2 mt-1">
            <div class="row mb-2">
              <div class="col-md-7">
                <span style="font-size:16px" class="label"><strong>${vehicle?.Device?.VehicleNo
      }</strong></span>
              </div>
              <div class="col-md-5">
            <span> <strong>Date: </strong> ${vehicle?.Eventdata
        ? this.formateDateValue(vehicle.Eventdata.GpsTimestamp)
        : ''
      }</span>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-md-7">
                <span><strong>Status:</strong> ${this.checkStauts(
        vehicle
      )}</span>
              </div> 
               <div class="col-md-5">
                <span ><strong>Speed: </strong>${vehicle?.Eventdata?.Speed
      } Km/H</span>
              </div>             
            </div>
            <div class="row mb-2">
              <div class="col-md-7">
                <span><strong>External Voltage:</strong>${this.checkvoltage(
        vehicle?.Eventdata?.EPC
      )}</span>
              </div>
              <div class="col-md-5">
                <span> <strong>Day Distance:</strong> ${this.dayDistanceValue || 0
      } Km</span>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-md-7">
                <span>  <strong>IMEI: </strong>${vehicle?.Device?.DeviceImei
      } </span>
              </div>
                <div class="col-md-5">
                <span> <strong>Odometer:</strong> ${this.updateOdometer(vehicle?.Device?.SoftOdometer)}</span>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-md-12 location-part">
                <span style="color: black" class="label"> ${processedAddress}</span>
              </div>
            </div>
            <hr />
        <div class="icon-part">
          <ul class="icon">
            ${generateIcon('fa-snowflake-o', 'AC', vehicle?.Peripherial?.AC)}
            ${generateIcon('fa-map-signs', 'Door', vehicle?.Peripherial?.Door)}
            ${generateIcon(
        'fa-thermometer-empty',
        'Temperature',
        vehicle?.Peripherial?.Temp
      )}         
         ${generateIcon(
        'fa-key',
        'Ignition',
        vehicle?.Peripherial?.ACC
      )}
            ${generateIcon(
        'fa-location-dot',
        'GPS',
        vehicle?.Eventdata?.GpsStatus
      )}
            ${generateIcon('fa-plug', 'Power', vehicle?.Eventdata?.EPC)}
            ${vehicle?.Battery?.status
        ? `<li><a><i class="fa fa-battery-full" style="color:${vehicle.Battery.color} !important"></i><br/><span class="live-value" style="color:black !important">${vehicle.Battery.status}</span></a></li>`
        : ''
      }
            <li><a  id="adminPlayId" title="Live" style="cursor:pointer"><i class="fa fa-circle-play" ></i><br/><span class="live-value" style="color:black !important">Live</span></a></li>
            <li><a  id="adminReplayId" title="Replay" style="cursor:pointer"><i class="fa fa-undo" ></i><br/><span class="live-value" style="color:black !important">Replay</span></a></li>
          </ul>
        </div>
          </div>
        </div>
      </div>`;
  }

  onCheckVehicleDevice(device: any) {
    // Get status from new API structure if available
    let status = device?.Status;
    let subStatus = device?.SubStatus;
    if (device?._original?.position?.status?.status) {
      const statusStr = device._original.position.status.status.toLowerCase();
      if (statusStr === 'running') {
        status = 1;
        subStatus = 1;
      } else if (statusStr === 'stop') {
        status = 1;
        subStatus = 2;
      } else if (statusStr === 'dormant') {
        status = 1;
        subStatus = 3;
      } else {
        status = 0;
        subStatus = 0;
      }
    }

    if (device?.Device?.VehicleType == 1) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_car_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_car_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_car_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_car_gray.png';
      }
    } else if (device?.Device?.VehicleType == 2) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_bus_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_bus_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_bus_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_bus_gray.png';
      }
    } else if (device?.Device?.VehicleType == 3) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_truck_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_truck_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_truck_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_truck_gray.png';
      }
    } else if (device?.Device?.VehicleType == 4) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_bike_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_bike_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_bike_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_bike_gray.png';
      }
    } else if (device?.Device?.VehicleType == 5) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_jcb_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_jcb_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_jcb_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_jcb_gray.png';
      }
    } else if (device?.Device?.VehicleType == 6) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_lifter_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_lifter_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_lifter_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_lifter_gray.png';
      }
    } else if (device?.Device?.VehicleType == 7) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_loader_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_loader_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_loader_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_loader_gray.png';
      }
    } else if (device?.Device?.VehicleType == 8) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_marker_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_marker_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_marker_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_marker_gray.png';
      }
    } else if (device?.Device?.VehicleType == 9) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_person_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_person_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_person_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_person_gray.png';
      }
    } else if (device?.Device?.VehicleType == 10) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_pet_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_pet_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_pet_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_pet_gray.png';
      }
    } else if (device?.Device?.VehicleType == 11) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_ship_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_ship_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_ship_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_ship_gray.png';
      }
    } else if (device?.Device?.VehicleType == 12) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_tanker_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_tanker_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_tanker_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_tanker_gray.png';
      }
    } else if (device?.Device?.VehicleType == 13) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/geen_taxi_f.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/blue_taxi_f.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/yellow_taxi_f.png';
      } else if (status === 0) {
        return 'assets/drawable/gray_taxi_f.png';
      }
    } else if (device?.Device?.VehicleType == 14) {
      if (status === 1 && subStatus === 1) {
        return 'assets/drawable/rp_marker_tractor_green.png';
      } else if (status === 1 && subStatus === 2) {
        return 'assets/drawable/rp_marker_tractor_blue.png';
      } else if (status === 1 && subStatus === 3) {
        return 'assets/drawable/rp_marker_tractor_yellow.png';
      } else if (status === 0) {
        return 'assets/drawable/rp_marker_tractor_gray.png';
      }
    }
    return "NA";
  }

  updateOdometer(data: any) {
    if (data == undefined || data == null) {
      return 'N/A';
    }
    else {
      const odo: number = parseFloat(data);
      if (odo === 0.0) {
        return 'N/A';
      } else {
        return `${odo.toFixed(1)} km`;
      }
    }
  }

  formateDateValue(date: any) {
    const formattedDate = this.datePipe.transform(
      date,
      'MMMM dd, yyyy HH:mm:ss'
    );
    return formattedDate;
  }

  sendFilteredData() {
    if (!this.confirmedVehicleId) return;
    if (this.confirmedVehicleId) {
      this.data.forEach((vehicle: any) => {
        if (!vehicle || !vehicle?.Eventdata) {
          return;
        }

        if (vehicle?.Device?.Id === this.confirmedVehicleId) {

          this.selectedVehicleValue = vehicle;

          const latestLatLng = L.latLng(
            vehicle?.Eventdata?.Latitude,
            vehicle?.Eventdata?.Longitude
          );

          this.map.setView(latestLatLng, 16);

          const newLocationComing = {
            lat: vehicle?.Eventdata?.Latitude,
            lon: vehicle?.Eventdata?.Longitude,
          };
          this.livemap.push(newLocationComing);

          this.updateMarker(latestLatLng, vehicle);
          this.getdayDistanceInfo(vehicle?.Device?.Id)
            .then(dayDistance => {
              this.dayDistanceValue = dayDistance
            })
        }
      });
    }
  }

  // updateMarker(
  //   latestLatLng: L.LatLng,
  //   data: any,
  //   prevLatLng?: L.LatLng
  // ) {
  //   const existingMarkerIndex = this.findExistingMarkerIndex(data?.Device?.VehicleNo);
  //   const address = {
  //     Lat: data?.Eventdata?.Latitude,
  //     Lng: data?.Eventdata?.Longitude,
  //   };
  //   let previousLat: any, previousLon: any;
  //   if (existingMarkerIndex !== -1) {
  //     previousLat = this.markers[existingMarkerIndex].getLatLng().lat;
  //     previousLon = this.markers[existingMarkerIndex].getLatLng().lng;
  //   }

  //   const currentLat = data.Eventdata?.Latitude;
  //   const currentLon = data.Eventdata?.Longitude;

  //   const deltaLat = currentLat - previousLat;
  //   const deltaLng = currentLon - previousLon;

  //   let heading = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);

  //   const canvas = document.createElement('canvas');
  //   const context: any = canvas.getContext('2d');
  //   const img = new Image();
  //   img.src = this.onCheckVehicleDevice(data);

  //   img.onload = () => {
  //     const canvasWidth = Math.max(img.width, img.height);
  //     const canvasHeight = canvasWidth;

  //     canvas.width = canvasWidth;
  //     canvas.height = canvasHeight;

  //     context.clearRect(0, 0, canvasWidth, canvasHeight);
  //     context.translate(canvasWidth / 2, canvasHeight / 2);
  //     context.rotate((heading || 0) * Math.PI / 180);
  //     context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
  //     context.rotate(-(heading || 0) * Math.PI / 180);
  //     context.translate(-canvasWidth / 2, -canvasHeight / 2);

  //     const icon = L.icon({
  //       iconUrl: canvas.toDataURL(),
  //       iconSize: [40, 40],
  //       iconAnchor: [20, 20],
  //     });

  //     const vehicleLabel = `${data?.Device?.VehicleNo}`;
  //     if (!this.polyline) {
  //       this.polyline = L.polyline([latestLatLng], {
  //         color: 'green',
  //         weight: 3,
  //         opacity: 2.0,
  //       }).addTo(this.map);
  //     }
  //     if (this.markers && this.markers.length > 0) {
  //       this.markers.forEach((marker: any) => {
  //         const startLatLng = marker.getLatLng();
  //         const animationDuration = 5000;
  //         const startTime = performance.now();

  //         if (!marker.popupManuallyClosed) {
  //           let popup = L.popup();
  //           this.addPopupListener(popup, data);
  //           popup
  //             .setContent(this.generateInfoWindowContent(data, 'Address is Loading...'))
  //             .setLatLng(startLatLng);

  //           this.getLiveAddressLocation(address)
  //             .pipe(
  //               map((addressValue) =>
  //                 this.generateInfoWindowContent(
  //                   data,
  //                   addressValue || 'Address not available')
  //               ),
  //               catchError(() =>
  //                 of(this.generateInfoWindowContent(data, 'Address not available'))
  //               )
  //             )
  //             .subscribe((content) => popup.setContent(content));
  //         }

  //         if (marker.getPopup() && marker.getPopup().isOpen()) {
  //           marker.getPopup().setContent(this.generateInfoWindowContent(data, 'Address is Loading...'));
  //           this.getLiveAddressLocation(address)
  //             .pipe(
  //               map((addressValue) =>
  //                 this.generateInfoWindowContent(
  //                   data,
  //                   addressValue || 'Address not available')
  //               ),
  //               catchError(() =>
  //                 of(this.generateInfoWindowContent(data, 'Address not available'))
  //               )
  //             )
  //             .subscribe((content) => marker.getPopup().setContent(content));
  //         }

  //         const animate = (time: number) => {
  //           const progress = Math.min(
  //             (time - startTime) / animationDuration,
  //             1
  //           );
  //           const intermediateLat =
  //             startLatLng.lat + (latestLatLng.lat - startLatLng.lat) * progress;
  //           const intermediateLng =
  //             startLatLng.lng + (latestLatLng.lng - startLatLng.lng) * progress;

  //           const intermediateLatLng = L.latLng(intermediateLat, intermediateLng);
  //           marker.setLatLng(intermediateLatLng);

  //           if (marker.getPopup() && marker.getPopup().isOpen()) {
  //             marker.getPopup().setLatLng(intermediateLatLng);
  //           }
  //           this.polyline?.addLatLng(intermediateLatLng);

  //           if (progress < 1) {
  //             this.animationRequest = requestAnimationFrame(animate);
  //           } else {
  //             marker.setLatLng(latestLatLng);
  //             if (marker.getPopup() && marker.getPopup().isOpen()) {
  //               marker.getPopup().setLatLng(latestLatLng);
  //             }
  //           }
  //         };

  //         // Start animation
  //         this.animationRequest = requestAnimationFrame(animate);
  //         marker.setIcon(icon);
  //         marker.bindTooltip(vehicleLabel, {
  //           permanent: false,
  //           direction: 'bottom',
  //           className: 'map-label',
  //         });
  //       });
  //     } else {
  //       // Add new marker if no markers exist
  //       const newMarker: any = L.marker(latestLatLng, { icon });
  //       newMarker.bindTooltip(vehicleLabel, {
  //         permanent: false,
  //         direction: 'bottom',
  //         className: 'map-label',
  //       });
  //       newMarker.popupManuallyClosed = false;

  //       newMarker.addTo(this.map);
  //       this.markers = [newMarker];
  //       this.polyline?.addLatLng(latestLatLng);

  //       let popup = L.popup()
  //         .setContent(this.generateInfoWindowContent(data, 'Address is Loading...'))
  //         .setLatLng(latestLatLng);
  //       newMarker.bindPopup(popup).openPopup();

  //       this.getLiveAddressLocation(address)
  //         .pipe(
  //           map((addressValue) =>
  //             this.generateInfoWindowContent(
  //               data,
  //               addressValue || 'Address not available')
  //           ),
  //           catchError(() =>
  //             of(this.generateInfoWindowContent(data, 'Address not available'))
  //           )
  //         )
  //         .subscribe((content) => popup.setContent(content));

  //       popup.on('close', () => {
  //         newMarker.popupManuallyClosed = true;
  //       });

  //       newMarker.on('click', () => {
  //         if (newMarker.popupManuallyClosed) {
  //           newMarker.openPopup();
  //           newMarker.popupManuallyClosed = false;
  //         }
  //       });

  //       this.addPopupListener(popup, data);
  //     }
  //   };
  // }

  updateMarker(latestLatLng: L.LatLng, data: any) {
      const existingMarkerIndex = this.findExistingMarkerIndex(data?.Device?.VehicleNo);
      const address = { Lat: data?.Eventdata?.Latitude, Lng: data?.Eventdata?.Longitude };
  
      const currentLat = data.Eventdata?.Latitude;
      const currentLon = data.Eventdata?.Longitude;
  
      let previousLat: number | null = null;
      let previousLon: number | null = null;
  
      if (existingMarkerIndex !== -1) {
        const prevLatLng = this.markers[existingMarkerIndex].getLatLng();
        previousLat = prevLatLng.lat;
        previousLon = prevLatLng.lng;
      }
  
      // Calculate heading only if there is a previous position
      let heading = 0;
      if (previousLat !== null && previousLon !== null) {
        const deltaLat = currentLat - previousLat;
        const deltaLng = currentLon - previousLon;
        heading = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);
      }
  
      const canvas = document.createElement('canvas');
      const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
      const img = new Image();
      img.src = this.onCheckVehicleDevice(data);
  
      img.onload = () => {
        const canvasSize = Math.max(img.width, img.height);
        canvas.width = canvas.height = canvasSize;
  
        if (context) {
          context.clearRect(0, 0, canvasSize, canvasSize);
          context.translate(canvasSize / 2, canvasSize / 2);
          context.rotate((heading || 0) * Math.PI / 180);
          context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
          context.resetTransform();
        }
  
        const icon = L.icon({
          iconUrl: canvas.toDataURL(),
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });
  
        const vehicleLabel = `${data?.Device?.VehicleNo}`;
        const markerAnimationDuration = 5000;
  
        if (existingMarkerIndex !== -1) {
          const marker: any = this.markers[existingMarkerIndex];
          const startLatLng = marker.getLatLng();
          const startTime = performance.now();
  
          if (!marker.popupManuallyClosed) {
            let popup = L.popup();
            this.addPopupListener(popup, data);
            popup
              .setContent(this.generateInfoWindowContent(data, 'Address is Loading...'))
              .setLatLng(startLatLng);
  
            this.getLiveAddressLocation(address)
              .pipe(
                map((addressValue) =>
                  this.generateInfoWindowContent(
                    data,
                    addressValue || 'Address not available')
                ),
                catchError(() =>
                  of(this.generateInfoWindowContent(data, 'Address not available'))
                )
              )
              .subscribe((content) => popup.setContent(content));
          }
  
          if (marker.getPopup() && marker.getPopup().isOpen()) {
            marker.getPopup().setContent(this.generateInfoWindowContent(data, 'Address is Loading...'));
            this.getLiveAddressLocation(address)
              .pipe(
                map((addressValue) =>
                  this.generateInfoWindowContent(
                    data,
                    addressValue || 'Address not available')
                ),
                catchError(() =>
                  of(this.generateInfoWindowContent(data, 'Address not available'))
                )
              )
              .subscribe((content) => marker.getPopup().setContent(content));
          }
  
          // Animation logic
          const animateMarker = (time: number) => {
            const progress = Math.min((time - startTime) / markerAnimationDuration, 1);
            const intermediateLat =
              startLatLng.lat + (latestLatLng.lat - startLatLng.lat) * progress;
            const intermediateLng =
              startLatLng.lng + (latestLatLng.lng - startLatLng.lng) * progress;
  
            const intermediateLatLng = L.latLng(intermediateLat, intermediateLng);
            marker.setLatLng(intermediateLatLng);
  
            if (this.polyline) {
              const lastPoint: any = this.polyline.getLatLngs().slice(-1)[0];
              if (!lastPoint || lastPoint.lat !== intermediateLat || lastPoint.lng !== intermediateLng) {
                this.polyline.addLatLng(intermediateLatLng);
              }
            }
  
            if (progress < 1) {
              this.animationRequest = requestAnimationFrame(animateMarker);
            } else {
              marker.setLatLng(latestLatLng);
              this.polyline?.addLatLng(latestLatLng);
            }
          };
  
          this.animationRequest = requestAnimationFrame(animateMarker);
  
          marker.setIcon(icon);
          marker.bindTooltip(vehicleLabel, {
            permanent: false,
            direction: 'bottom',
            className: 'map-label',
          });
        } else {
          // Add new marker if not found
          const newMarker: any = L.marker(latestLatLng, { icon });
          newMarker.bindTooltip(vehicleLabel, {
            permanent: false,
            direction: 'bottom',
            className: 'map-label',
          });
          newMarker.addTo(this.map);
  
          // Polyline logic
          if (!this.polyline) {
            this.polyline = L.polyline([latestLatLng], {
              color: 'green',
              weight: 3,
              opacity: 0.8,
            }).addTo(this.map);
          } else {
            this.polyline.addLatLng(latestLatLng);
          }
  
          // Popup logic
          const popup = L.popup()
            .setContent(this.generateInfoWindowContent(data, 'Address is Loading...'))
            .setLatLng(latestLatLng);
  
          newMarker.bindPopup(popup).openPopup();
  
          this.getLiveAddressLocation(address)
            .pipe(
              map((addressValue) =>
                this.generateInfoWindowContent(
                  data,
                  addressValue || 'Address not available'
                )
              ),
              catchError(() =>
                of(this.generateInfoWindowContent(data, 'Address not available'))
              )
            )
            .subscribe((content) => popup.setContent(content));
  
          popup.on('close', () => {
            newMarker.popupManuallyClosed = true;
          });
  
          newMarker.on('click', () => {
            if (newMarker.popupManuallyClosed) {
              newMarker.openPopup();
              newMarker.popupManuallyClosed = false;
            }
          });
  
          this.addPopupListener(popup, data);
          this.markers.push(newMarker);
        }
      };
    }

  addPopupListener(popup: L.Popup, data: any) {
    popup.on('contentupdate', () => {
      const playLink = document.getElementById('adminPlayId');
      const replayLink = document.getElementById('adminReplayId');
      const geoButton = document.getElementById('geofanceId')

      if (playLink) {
        playLink.addEventListener('click', (event) => this.handlePlayClickData(event, data));
      }
      if (replayLink) {
        replayLink.addEventListener('click', (event) => this.handleRePlayClick(event, data));
      }

      // if (geoButton) {
      //   geoButton.addEventListener('click', (event) => this.handleGeofanceClick(event, data));
      // }
    });
  }

  handlePlayClickData(event: MouseEvent, vehicle: any) {
    console.log("check datat----");
    
    this.liveData = vehicle
    this.selectVehicle(this.liveData)
    event.preventDefault();
    this.vehicleListshow = false;
    this.liveTime = true;
  }

  handleRePlayClick(event: MouseEvent, vehilce?: any) {
    this.liveData = vehilce
    let url = `admin/history-tracking/${this.liveData?.Device?.Id}`;
    this.router.navigateByUrl(url);
  }

  checkvoltage(value: any) {
    if (value === 0 || value === undefined || value === null) {
      return 'Not Connected';
    } else {
      return 'Connected';
    }
  }

  getdayDistanceInfo(vehicle: any): Promise<number> {
    const params = {
      id: this.selectedCustomer,
      deviceid: vehicle,
    };
    return this.dashboardService.getDistanceday(params)
      .toPromise()
      .then((res: any) => {
        return res?.Result?.Data[0]?.totaldistance;
      });
  }


  checkStauts(vehicle: any) {
    // Use new API structure if available
    if (vehicle?._original?.position?.status?.status) {
      const status = vehicle._original.position.status.status;
      const duration = vehicle._original.position.status.duration || '';
      
      // Map status values
      const statusMap: any = {
        'running': 'Running',
        'stop': 'Stop',
        'dormant': 'Dormant',
        'offline': 'Offline',
        'never connected': 'Never Connected',
        'point expired': 'Point Expired'
      };
      
      const statusText = statusMap[status.toLowerCase()] || status;
      
      if (duration) {
        return `${statusText} (${duration})`;
      }
      return statusText;
    }
    
    // Fallback to old structure
    if (!vehicle || !vehicle?.StatusDuration || vehicle?.StatusDuration == null)
      return '';
    const parts = vehicle.StatusDuration.split(' ');
    if (parts[0] === 'Never') {
      return `${vehicle.StatusDuration}`;
    }
    if (!vehicle || !vehicle.StatusDuration || !vehicle?.Eventdata) {
      return '';
    }

    const formattedTime = this.commonService.formatTimeValue(parts[2]);
    return `${parts[0]}(${formattedTime})`;
  }


  selectVehicle(event: any) {
    this.clearMarkers();
    this.isInfoShow = true;
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
    }
    this.liveData = event;
    if (event && event.Eventdata && event?.Device && event.Device?.Id) {
      this.confirmedVehicleId = event?.Device?.Id;
      this.sendFilteredData();
    }
  }

  selectVehiclesPlot(event: any) {
    this.confirmedVehicleId = null;
    this.liveData = null;
    this.vehicleData = [];
    this.infoVehicleWindows = [];
    this.clearMarkers()
  }

  closeTab(event: any) { 
    this.confirmedVehicleId = null;
    this.liveData = null
    this.infoVehicleWindows = [];
    this.vehicleListshow = true;
    this.liveTime = false;
   this.clearMarkers()
    this.subscription?.unsubscribe();
    this.getVehicleData() // No parameter needed for new API
  }

  clearMarkers() {
    this.confirmedVehicleId = null;
    this.closeAllInfoWindows()
    if (this.markers && this.markers.length > 0) {
      this.markers.forEach((marker: any) => {
        marker.remove();
      });
      this.markers = [];
    }

    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
    }

    if (this.polyline) {
      this.polyline.remove();
      this.polyline = null;
    }

    // this.initializeMap().then(() => {
    //   console.log('Map has been reset and reinitialized.');
    // });
  }

  closeAllInfoWindows() {
    for (const infoWindow of this.infoVehicleWindows) {
      infoWindow.close();
    }
  }
}
