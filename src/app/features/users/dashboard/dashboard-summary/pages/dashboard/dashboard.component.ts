import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { BreadcrumbItems } from 'src/app/features/shared/interfaces';
import { DashboardService } from '../../services/dashboard.service';
import {
  EMPTY,
  Observable,
  Subject,
  Subscription,
  catchError,
  debounceTime,
  filter,
  from,
  interval,
  map,
  of,
  share,
  switchMap,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { SiteFooterComponent } from 'src/app/features/shared/layouts/components/site-footer/site-footer.component';
import { CommonService } from 'src/app/features/shared/services/common.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { DatePipe, Location } from '@angular/common';
import { GeofanceService } from 'src/app/features/users/geofance/geofance-manage/services/geofance.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild('footerData', { static: true }) footerData!: SiteFooterComponent;
  lat = 28.5851;
  lng = 77.3116;
  zoom = 10;
  map: google.maps.Map | any;
  drawingManager: google.maps.drawing.DrawingManager | any;
  drawnPolygon: google.maps.Polygon | any;
  polygonCoordinates: google.maps.LatLng[] | any;
  cornerMarkers: google.maps.Marker[] = [];
  currentInfoWindow: google.maps.InfoWindow | null = null;
  marker: google.maps.Marker[] = [];
  mapOptions: any;
  vehicleData: any;
  infoWindow: any;
  subscription: Subscription | any;
  debounceTimer!: ReturnType<typeof setTimeout>;
  vehilceOnMapdata: any;
  liveSubscription: Subscription | any;
  liveVehicle: any = [];
  polyline: google.maps.Polyline | any;
  wapointmarker: google.maps.Marker | any;
  wapointmarkerpolylines: google.maps.Polyline | any;
  path: google.maps.LatLng[] | any;
  markers: google.maps.Marker[] = [];
  private unsubscribeRouteChange$ = new Subject<void>();
  vehicleListshow: boolean = true;
  selectedVehicleData: any;
  historyData: any;

  countdown: number | undefined;
  spinnerLoading: boolean = false;
  isPageSize: boolean = true;
  liveData: any;
  livemap: any = [];
  selectedStatus: any;
  data: any =  [];
  vehicleListHeight: any;
  vehicleDatacount: any;
  icon: any;
  vehicleInfoData: any;
  infoVehicleWindows: google.maps.InfoWindow[] = [];
  confirmedVehicleId: string | null = null;
  filteredVehicleData: any[] = [];
  flagMarker: google.maps.Marker | any;
  lastKnownAddresses = 'Address is Loading...';
  isInfoShow: boolean = true;
  drawnCircle: google.maps.Circle | any;
  selectedVehicleValue: any;
  selectVehilce: any;
  userDetail: any;
  dayDistanceValue: any;
 vehicleDataValue:any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private NotificationService: NotificationService,
    private dashbaordService: DashboardService,
    private el: ElementRef,
    private commonService: CommonService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private storageService: StorageService,
    private geoservice: GeofanceService,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private CommonService: CommonService,
    private dashboardService: DashboardService,
    private location: Location,
    private refreshCustomerService : RefreshCustomerService
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribeRouteChange$)
      )
      .subscribe((event: any) => {
        this.unsubscribe();
      });
  }

  ngOnInit() {
    const wasReloaded = sessionStorage.getItem('wasReloaded');
    
    if (wasReloaded === 'true') {
      this.vehicleDataValue = null;
      sessionStorage.removeItem('wasReloaded'); 
    } else {
      this.vehicleDataValue = this.location.getState();
      if (this.vehicleDataValue) {
        this.confirm(this.vehicleDataValue?.vehicleData);
      }
    }

    window.onbeforeunload = () => {
      sessionStorage.setItem('wasReloaded', 'true');
    };

    sessionStorage.removeItem('wasReloaded');
    this.storageService.removeItem('status');
    this.initializeMap(this.lat, this.lng, this.zoom);
    this.getVehicleData();
    this.getuserDetail()
  }

  ngOnDestroy(): void {
    this.unsubscribeRouteChange$.next();
    this.unsubscribeRouteChange$.complete();
    const playLink = this.el.nativeElement.querySelector('#play');
    if (playLink) {
      playLink.removeEventListener('click', this.handlePlayClick.bind(this));
    }
    this.subscription?.unsubscribe();
    this.liveSubscription?.unsubscribe();
  }

  getuserDetail() {
    this.storageService.getItem("userDetail").subscribe((value: any) => {
      this.userDetail = value
    })
  }

  initializeMap(lat: any, long: any, zoomvalue: any) {
    const mapOptions = {
      center: { lat: lat, lng: long },
      zoom: zoomvalue,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLDivElement,
      mapOptions
    );
    const marker = new google.maps.Marker({
      position: { lat: lat, lng: long },
      map: this.map,
      icon: {
        url: '',
        scaledSize: new google.maps.Size(30, 30),
      },
    });
    this.marker.push(marker);
  }

  private unsubscribe$ = new Subject<void>();
  @Output() onConfirm = new EventEmitter();

  getVehicleData() {
    this.spinnerLoading = true;
    this.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.subscription = timer(0, 10000)
      .pipe(
        tap((value) => {
          this.countdown = value % 10 === 0 ? 0 : 10 - (value % 10);
          this.counter = 10;
          clearInterval(this.counterInterval);
          this.counterInterval = setInterval(() => {
            this.counter--;
          }, 1000);
        }),
        switchMap(() => this.dashbaordService.vehicleListDetail()),
        tap((res: any) => {
          this.spinnerLoading = false;
          this.data = res?.body?.Result?.Data || [];
          this.vehicleDatacount = res?.body?.Result?.Data || [];
          this.sendFilteredData();
        }),
        switchMap(() => this.storageService.getItem('status')),
        tap((status: any) => {
          this.selectedStatus = status;
          this.filterout(this.data);
          this.onConfirm.emit(true);
          this.plotVehicleonMap();
        })
      )
      .subscribe(
        () => { },
        (error) => {
          console.error('Error fetching vehicle data:', error);
          this.spinnerLoading = false;
        }
      );
  }

  filterout(data: any): Observable<any> {    
    if (this.selectedStatus === 'Offline') {
      this.vehicleData = data.filter((res: any) => res?.Status == 0);
    } else if (this.selectedStatus === 'Running') {
      this.vehicleData = data.filter(
        (res: any) => res?.Status == 1 && res?.SubStatus == 1
      );
    } else if (this.selectedStatus === 'Stop') {
      this.vehicleData = data.filter(
        (res: any) => res?.Status == 1 && res?.SubStatus == 2
      );
    } else if (this.selectedStatus === 'Idle') {
      this.vehicleData = data.filter(
        (res: any) => res?.Status == 1 && res?.SubStatus == 3
      );
    } else if (this.selectedStatus === 'Expired Soon') {
      this.vehicleData = data.filter((res: any) =>  res?.Status == 1 && res?.SubStatus == 4);      
    } else if (this.selectedStatus === 'Expired') {
      this.vehicleData = data.filter((res: any) => res?.Status == 2);
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

  clickedMarker: google.maps.Marker | null = null;
  clickedInfoWindow: google.maps.InfoWindow | null = null;

  plotVehicleonMap() {
    if (this.liveData) {
      return;
    }
    const vehicleObs$ = from(this.vehilceOnMapdata);

    vehicleObs$.pipe(
      switchMap((vehicle: any, index: number) => {
        if (!vehicle?.Eventdata) {
          return EMPTY;
        }
        const existingMarkerIndex = this.findExistingMarkerIndex(vehicle.Device.VehicleNo);
        const canvas = document.createElement('canvas');
        const context: any = canvas.getContext('2d');

        const img = new Image();
        img.src = this.onCheckVehicleDevice(vehicle);

        return new Promise(resolve => {
          img.onload = () => {
            const canvasWidth = Math.max(img.width, img.height);
            const canvasHeight = canvasWidth;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            context.clearRect(0, 0, canvasWidth, canvasHeight);

            context.translate(canvasWidth / 2, canvasHeight / 2);
            context.rotate((vehicle?.Eventdata?.Heading || 0) * Math.PI / 180);
            context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
            context.rotate(-(vehicle?.Eventdata?.Heading || 0) * Math.PI / 180);
            context.translate(-canvasWidth / 2, -canvasHeight / 2);

            const icon = {
              url: canvas.toDataURL(),
              scaledSize: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(10, 15),
            };

            const newPosition = new google.maps.LatLng(vehicle?.Eventdata?.Latitude, vehicle?.Eventdata?.Longitude);
            resolve({ vehicle, icon, newPosition, existingMarkerIndex });
          };
        }).then((data: any) => {
          const { vehicle, icon, newPosition, existingMarkerIndex } = data;

          if (existingMarkerIndex !== -1) {
            this.markers[existingMarkerIndex].setIcon(icon);
            this.markers[existingMarkerIndex].setPosition(newPosition);
            if (
              !vehicle || 
              !vehicle?.StatusDuration || 
              vehicle?.StatusDuration == null || 
              !vehicle?.Eventdata ||
              (vehicle?.ResultCode == 3 && vehicle?.PointValidity?.CurrentPointType == 0) || 
              (vehicle?.ResultCode == 3 && vehicle?.PointValidity?.CurrentPointType == 1) || 
              (vehicle?.ResultCode == 4 && vehicle?.PointValidity?.CurrentPointType == 0) || 
              (vehicle?.ResultCode == 4 && vehicle?.PointValidity?.CurrentPointType == 1)
            ) return;
            const parts = vehicle.StatusDuration.split(' ');
            if (parts[0] === 'Never') {
              return;
            }

            const infoWindow: any = this.infoVehicleWindows[existingMarkerIndex];
            if (infoWindow && this.clickedMarker === this.markers[existingMarkerIndex]) {
              const clickedMarkerText = this.clickedMarker.getLabel()?.text;
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
                infoWindow.setContent(initialContent);
                this.getdayDistanceInfo(vehicle?.Device?.Id)
                .then(dayDistance => {
                  this.dayDistanceValue = dayDistance
                })
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
                  .subscribe((content) => infoWindow.setContent(content));
              }
            }
          } else {
            const infoWindow = new google.maps.InfoWindow();
            this.createMarker(vehicle, index, icon, infoWindow);
            this.infoVehicleWindows.push(infoWindow);
          }
          return Promise.resolve();
        });
      }),
      switchMap(() => interval(10000).pipe(takeUntil(this.destroy$))),
      take(1)
    ).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  getLiveAddressLocation(address: any): Observable<any> {
    return this.commonService
      .getAddressInfoDetail(address)
      .pipe(map((res: any) => res));
  }

  getdayDistanceInfo(vehicle: any): Promise<number> {
    const params = {
      id: this.userDetail.userId,
      deviceid: vehicle,
    };

    return this.dashboardService.getDistanceday(params)
      .toPromise()
      .then((res: any) => {
        return res?.Result?.Data[0]?.totaldistance;
      });
  }


  findExistingMarkerIndex(vehicleNo: string): any {
    return this.markers.findIndex(
      (marker) => marker.getLabel()?.text === vehicleNo
    );
  }

  createMarker(
    vehicle: any,
    index: number,
    icon: any,
    infoWindow: google.maps.InfoWindow
  ) {
    const newPosition = new google.maps.LatLng(
      vehicle?.Eventdata?.Latitude,
      vehicle?.Eventdata?.Longitude
    );

    const marker = new google.maps.Marker({
      position: newPosition,
      map: this.map,
      icon: icon,
      label: {
        text: `${vehicle?.Device?.VehicleNo}`,
        className: 'map-label',
      },
      optimized: true,
    });


    marker.addListener('click', () => {      
      if (
        !vehicle || 
        !vehicle?.StatusDuration || 
        vehicle?.StatusDuration == null || 
        !vehicle?.Eventdata || (!vehicle?.Eventdata?.Latitude && !vehicle?.Eventdata?.Longitude) || 
        (vehicle?.ResultCode == 3 && vehicle?.PointValidity?.CurrentPointType == 0) || 
        (vehicle?.ResultCode == 3 && vehicle?.PointValidity?.CurrentPointType == 1) || 
        (vehicle?.ResultCode == 4 && vehicle?.PointValidity?.CurrentPointType == 0) || 
        (vehicle?.ResultCode == 4 && vehicle?.PointValidity?.CurrentPointType == 1)
      ) return;
      const parts = vehicle.StatusDuration.split(' ');
      if (parts[0] === 'Never') {
        return;
      }
      this.closeAllInfoWindows();
      const address = {
        Lat: vehicle?.Eventdata?.Latitude,
        Lng: vehicle?.Eventdata?.Longitude,
      };

      this.clickedMarker = marker;
      this.clickedInfoWindow = infoWindow;
      this.getdayDistanceInfo(vehicle?.Device?.Id)
        .then(dayDistance => {
          this.dayDistanceValue = dayDistance
        })

      const initialContent = this.generateInfoWindowContent(
        vehicle,
        'Address is Loading...');
      infoWindow.addListener('domready', () => {
        const playLink = document.getElementById('playId');
        const replayLink = document.getElementById('replayId');
        if (playLink) {
          playLink.addEventListener('click', (event) => this.handlePlayClickData(event, vehicle));
        }
        if (replayLink) {
          replayLink.addEventListener('click', (event) => this.handleRePlayClick(event, vehicle));
        }
      });
      infoWindow.setContent(initialContent);
      infoWindow.open(this.map, marker);

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
        .subscribe((content) => infoWindow.setContent(content));


    });
    this.markers.push(marker);
    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach((marker: any) => {
      bounds.extend(marker.getPosition());
    });
    this.map.fitBounds(bounds);
    this.map.setZoom(10);
  }

  handlePlayClickData(event: MouseEvent, vehicle: any) {
    this.liveData = vehicle
    this.confirm(this.liveData)
    event.preventDefault();
    this.vehicleListshow = false;
    this.liveTime = true;
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
            <li><a  id="geofanceId" title="Geofance" style="cursor:pointer"><i class="fa fa-map-o" ></i><br/><span class="live-value" style="color:black !important">Geofance</span></a></li>
            <li><a  id="playId" title="Live" style="cursor:pointer"><i class="fa fa-circle-play" ></i><br/><span class="live-value" style="color:black !important">Live</span></a></li>
            <li><a  id="replayId" title="Replay" style="cursor:pointer"><i class="fa fa-undo" ></i><br/><span class="live-value" style="color:black !important">Replay</span></a></li>
          </ul>
        </div>
          </div>
        </div>
      </div>`;
  }

  closeAllInfoWindows() {
    for (const infoWindow of this.infoVehicleWindows) {
      infoWindow.close();
    }
  }

  onCheckVehicleDevice(device: any) {
    if (device?.Device?.VehicleType == 1) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_car_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_car_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_car_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_car_gray.png';
      }
    } else if (device?.Device?.VehicleType == 2) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_bus_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_bus_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_bus_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_bus_gray.png';
      }
    } else if (device?.Device?.VehicleType == 3) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_truck_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_truck_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_truck_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_truck_gray.png';
      }
    } else if (device?.Device?.VehicleType == 4) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_bike_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_bike_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_bike_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_bike_gray.png';
      }
    } else if (device?.Device?.VehicleType == 5) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_jcb_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_jcb_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_jcb_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_jcb_gray.png';
      }
    } else if (device?.Device?.VehicleType == 6) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_lifter_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_lifter_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_lifter_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_lifter_gray.png';
      }
    } else if (device?.Device?.VehicleType == 7) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_loader_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_loader_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_loader_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_loader_gray.png';
      }
    } else if (device?.Device?.VehicleType == 8) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_marker_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_marker_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_marker_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_marker_gray.png';
      }
    } else if (device?.Device?.VehicleType == 9) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_person_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_person_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_person_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_person_gray.png';
      }
    } else if (device?.Device?.VehicleType == 10) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_pet_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_pet_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_pet_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_pet_gray.png';
      }
    } else if (device?.Device?.VehicleType == 11) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_ship_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_ship_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_ship_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_ship_gray.png';
      }
    } else if (device?.Device?.VehicleType == 12) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_tanker_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_tanker_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_tanker_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_tanker_gray.png';
      }
    } else if (device?.Device?.VehicleType == 13) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/geen_taxi_f.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/blue_taxi_f.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/yellow_taxi_f.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/gray_taxi_f.png';
      }
    } else if (device?.Device?.VehicleType == 14) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/rp_marker_tractor_green.png';
      } else if (device?.Status === 1 && device?.SubStatus === 2) {
        return 'assets/drawable/rp_marker_tractor_blue.png';
      } else if (device?.Status === 1 && device?.SubStatus === 3) {
        return 'assets/drawable/rp_marker_tractor_yellow.png';
      } else if (device?.Status === 0) {
        return 'assets/drawable/rp_marker_tractor_gray.png';
      }
    }
    return 'NA';
  }

  private destroy$ = new Subject<void>();

  getVehicleColor(vehicle: any): string {
    if (vehicle?.Status === 1 && vehicle?.SubStatus === 1) {
      return 'rgb(25 173 0)';
    } else if (vehicle?.Status === 1 && vehicle?.SubStatus === 2) {
      return '#4861ED';
    } else if (vehicle?.Status === 1 && vehicle?.SubStatus === 3) {
      return '#FFAF1D';
    } else if (vehicle?.Status === 0) {
      return '#696969';
    } else {
      return 'black';
    }
  }

  checkStauts(vehicle: any) {
    if (!vehicle || !vehicle?.StatusDuration || vehicle?.StatusDuration == null)
      return;
    const parts = vehicle.StatusDuration.split(' ');
    if (parts[0] === 'Never') {
      return `${vehicle.StatusDuration}`;
    }
    if (!vehicle || !vehicle.StatusDuration || !vehicle?.Eventdata) {
      return '';
    }

    const formattedTime = this.CommonService.formatTimeValue(parts[2]);
    return `${parts[0]}(${formattedTime})`;
  }

  /**
   * clear all marker from map
   */
  clearMarkers() {
    this.unsubscribe();
    if (this.marker) {
      this.marker.forEach((marker: any) => {
        marker.setMap(null);
      });
      this.marker = [];
    }
    if (this.wapointmarkerpolylines) {
      this.wapointmarkerpolylines.setMap(null);
    }
    if (this.wapointmarker) {
      this.wapointmarker.setMap(null);
    }
    if (this.liveSubscription) {
      this.liveSubscription.unsubscribe();
      this.liveSubscription = undefined;
    }
    this.map = undefined;
    this.vehilceOnMapdata = [];
    this.initializeMap(this.lat, this.lng, this.zoom);
  }

  confirm(event: any) {
    this.closeAllInfoWindows();
    this.isInfoShow = true;
    this.livemap = [];
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
    if (this.flagMarker) {
      this.flagMarker.setMap(null);
      this.flagMarker = null;
    }

    if (this.markers) {
      this.markers.forEach((marker: any) => {
        marker.setMap(null);
      });
      this.markers = [];
    }

    this.liveData = event;
    if (event && event.Eventdata && event?.Device && event.Device?.Id) {
      this.confirmedVehicleId = event?.Device?.Id;
      this.sendFilteredData();
    }
    // this.clearMarkers();
    // if (this.polyline) {
    //   this.livemap = []
    //   this.polyline.setMap(null);
    //   this.polyline = null;
    // }
    // this.liveTracking(event)
  }

  sendFilteredData() {
    if (!this.confirmedVehicleId) return;
    this.unsubscribe();
    if (this.confirmedVehicleId) {
      this.data.forEach((vehicle: any) => {
        if (!vehicle || !vehicle?.Eventdata || vehicle?.Eventdata == null) {
          return;
        }
        if (vehicle) {
          if (vehicle?.Device?.Id === this.confirmedVehicleId) {
            this.footerData.setData(vehicle);
            this.selectedVehicleValue = vehicle;
            const latestLatLng = new google.maps.LatLng(
              vehicle?.Eventdata?.Latitude,
              vehicle?.Eventdata?.Longitude
            );
            this.map.setCenter(latestLatLng);
            this.map.setZoom(17);
            const newLocationComing = {
              lat: vehicle?.Eventdata?.Latitude,
              lon: vehicle?.Eventdata?.Longitude,
            };

            this.livemap.push(newLocationComing);
            this.getdayDistanceInfo(this.liveData?.Device?.Id)
              .then(dayDistance => {
                this.dayDistanceValue = dayDistance
              })
            this.updateMarker(latestLatLng, vehicle);
            this.updatePolylines();
          }
        }
      });
    }
  }
  setZoom(event: any) {
    this.map.setZoom(parseInt(event));
  }
  private liveUnsubscribe$ = new Subject<void>();

  counter: number = 10;
  counterInterval: any = null;

  liveTracking(event: any) {
    this.unsubscribeLiveTracking();
    this.liveUnsubscribe$.next();
    this.liveUnsubscribe$.complete();

    this.liveSubscription = timer(0, 10000)
      .pipe(
        tap((value) => {
          this.countdown = value % 10 === 0 ? 0 : 10 - (value % 10);
          this.counter = 10;
          clearInterval(this.counterInterval);
          this.counterInterval = setInterval(() => {
            this.counter--;
          }, 1000);
        }),
        switchMap(() => {
          let payload = event?.Device?.Id;
          return this.dashbaordService.liveVehicleTrack(payload);
        }),
        takeUntil(this.liveUnsubscribe$)
      )
      .subscribe((res: any) => {
        let newLocation = res?.body?.Result?.Data;
        this.historyData = res?.body?.Result?.Data;
        if (
          !newLocation ||
          !newLocation?.Eventdata ||
          newLocation?.Eventdata == null
        ) {
          return;
        }
        if (newLocation) {
          const latestLatLng = new google.maps.LatLng(
            newLocation?.Eventdata?.Latitude,
            newLocation?.Eventdata?.Longitude
          );
          this.updateMarker(latestLatLng, newLocation);
          this.map.setCenter(latestLatLng);
          this.map.setZoom(17);
          const newLocationComing = {
            lat: this.historyData?.Eventdata?.Latitude,
            lon: this.historyData?.Eventdata?.Longitude,
          };

          this.livemap.push(newLocationComing);
          this.updatePolylines()
        }
      });
  }

  updatePolylines() {
    const path = this.livemap.map((bus: any) => ({
      lat: bus.lat,
      lng: bus.lon,
    }));

    this.flagMarker = new google.maps.Marker({
      position: path[0],
      map: this.map,
      icon: {
        url: '',
        scaledSize: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 20),
      },
    });

    const lastLocation = this.livemap[this.livemap.length - 1];
    const lastLocationLatLng = new google.maps.LatLng(
      lastLocation.lat,
      lastLocation.lon
    );

    if (this.polyline) {
      this.polyline.setMap(null);
    }

    if (this.map.getZoom() < 15) {
      this.map.setCenter(lastLocationLatLng);
      this.map.setZoom(15);
    }

    // Create a new polyline
    this.polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: 'green',
      strokeOpacity: 2.0,
      strokeWeight: 3,
    });

    this.polyline.setMap(this.map);
  }
  unsubscribeLiveTracking() {
    if (this.liveSubscription) {
      this.liveSubscription.unsubscribe();
      this.liveSubscription = undefined;
    }
    this.liveUnsubscribe$.next();
  }

  updateMarker(
    latestLatLng: google.maps.LatLng,
    data: any,
    prevLatLng?: google.maps.LatLng
  ) {
    let heading = 0;
    if (prevLatLng) {
      heading = data?.Eventdata?.Heading;
    }
    const canvas = document.createElement('canvas');
    const context: any = canvas.getContext('2d');
    const img = new Image();
    img.src = this.onCheckVehicleDevice(data);
    img.onload = () => {
      const canvasWidth = Math.max(img.width, img.height);
      const canvasHeight = canvasWidth;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.translate(canvasWidth / 2, canvasHeight / 2);
      context.rotate(((data?.Eventdata?.Heading || 0) * Math.PI) / 180);
      context.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );
      context.rotate((-(data?.Eventdata?.Heading || 0) * Math.PI) / 180);
      context.translate(-canvasWidth / 2, -canvasHeight / 2);

      const icon = {
        url: canvas.toDataURL(),
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 20),
      };

      const label = {
        text: `${data?.Device?.VehicleNo}`,
        className: 'map-label'
      };

      if (this.marker) {
        this.marker.forEach((marker: any) => {
          marker.setPosition(latestLatLng);
          marker.setIcon(icon);
          marker.setLabel(label);
          if (!marker.infoWindowOpen) {
            marker.infoWindowOpen = false;
            this.openInfo(marker, data);
          }
        });
      } else {
        const newMarker: any = new google.maps.Marker({
          position: latestLatLng,
          map: this.map,
          icon: icon,
          label: label
        });
        newMarker.infoWindowOpen = true;
        this.openInfo(newMarker, data);
        this.marker = [newMarker];
      }
    };
  }

  // updateMarker(latestLatLng: google.maps.LatLng, data: any, prevLatLng?: google.maps.LatLng) {
  //     let heading = 0;
  //     if (prevLatLng) {
  //       heading = data?.Eventdata?.Heading;
  //     }
  //     const canvas = document.createElement('canvas');
  //     const context: any = canvas.getContext('2d');
  //     const img = new Image();
  //     img.src = this.onCheckVehicleDevice(data);
  //     img.onload = () => {
  //       const canvasWidth = Math.max(img.width, img.height);
  //       const canvasHeight = canvasWidth;
  //       canvas.width = canvasWidth;
  //       canvas.height = canvasHeight;
  //       context.clearRect(0, 0, canvasWidth, canvasHeight);
  //       context.translate(canvasWidth / 2, canvasHeight / 2);
  //       context.rotate((data?.Eventdata?.Heading || 0) * Math.PI / 180);
  //       context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
  //       context.rotate(-(data?.Eventdata?.Heading || 0) * Math.PI / 180);
  //       context.translate(-canvasWidth / 2, -canvasHeight / 2);
  //       const icon = {
  //         url: canvas.toDataURL(),
  //         scaledSize: new google.maps.Size(40, 40),
  //         origin: new google.maps.Point(0, 0),
  //         anchor: new google.maps.Point(20, 20),
  //       };
  //       if (this.marker) {
  //         this.marker.forEach((marker: any) => {
  //           this.animateMarker(marker, latestLatLng, data);
  //           marker.setIcon(icon);
  //           if (!marker.infoWindowOpen) {
  //             marker.infoWindowOpen = false;
  //             this.openInfo(marker, data);
  //           }
  //         });
  //       } else {
  //         const newMarker: any = new google.maps.Marker({
  //           position: latestLatLng,
  //           map: this.map,
  //           icon: icon,
  //         });
  //         newMarker.infoWindowOpen = true;
  //         this.openInfo(newMarker, data);
  //         this.marker = [newMarker];
  //       }
  //     }
  //   }
  //   animateMarker(marker: google.maps.Marker, toLatLng: google.maps.LatLng, data: any) {
  //     const fromLatLng : any = marker?.getPosition();
  //     const frames = 30; // Number of animation frames
  //     const duration = 1100; // Animation duration in milliseconds
  //     const interval = duration / frames;
  //     let frame = 0;
  //     const deltaLat = (toLatLng.lat() - fromLatLng?.lat()) / frames;
  //     const deltaLng = (toLatLng.lng() - fromLatLng?.lng()) / frames;
  //     const animate = () => {
  //       frame++;
  //       const nextLatLng = new google.maps.LatLng(
  //         fromLatLng.lat() + deltaLat * frame,
  //         fromLatLng.lng() + deltaLng * frame
  //       );
  //       // Calculate the heading for each frame
  //       const heading = google.maps.geometry.spherical.computeHeading(fromLatLng, nextLatLng);
  //       // Update the marker icon with rotation
  //       this.updateMarkerIcon(marker, heading, data);
  //       marker.setPosition(nextLatLng);
  //       if (frame < frames) {
  //         requestAnimationFrame(animate);
  //       } else {
  //         marker.setPosition(toLatLng);
  //       }
  //     };
  //     animate();
  //   }
  //   updateMarkerIcon(marker: google.maps.Marker, heading: number, data: any) {
  //     const canvas = document.createElement('canvas');
  //     const context: any = canvas.getContext('2d');
  //     const img = new Image();
  //     img.src = this.onCheckVehicleDevice(data);
  //     img.onload = () => {
  //       const canvasWidth = Math.max(img.width, img.height);
  //       const canvasHeight = canvasWidth;
  //       canvas.width = canvasWidth;
  //       canvas.height = canvasHeight;
  //       context.clearRect(0, 0, canvasWidth, canvasHeight);
  //       context.translate(canvasWidth / 2, canvasHeight / 2);
  //       context.rotate((heading || 0) * Math.PI / 180);
  //       context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
  //       context.rotate(-(heading || 0) * Math.PI / 180);
  //       context.translate(-canvasWidth / 2, -canvasHeight / 2);
  //       const icon = {
  //         url: canvas.toDataURL(),
  //         scaledSize: new google.maps.Size(40, 40),
  //         origin: new google.maps.Point(0, 0),
  //         anchor: new google.maps.Point(20, 20),
  //       };
  //       marker.setIcon(icon);
  //     };
  //   }

  latestLat = null;
  latestLng = null;
  livesubscription: any;

  openInfo(marker: google.maps.Marker | any, data: any) {
    const address = {
      Lat: data.Eventdata?.Latitude,
      Lng: data.Eventdata?.Longitude,
    };

    const generateContent = (addressContent: string) =>
      `<div class="live-data" appCustomClick>
        <div class="row mb-2">
          <div class="col-md-7">
            <span style="font-size:16px"><strong>${data?.Device?.VehicleNo ?? 'NA'
      }</strong></span>
          </div>
          <div class="col-md-5">
            <span> <strong>Date: </strong> ${data?.Eventdata
        ? this.formateDateValue(data.Eventdata.GpsTimestamp)
        : ''
      }</span>
          </div>
        </div>
        <div class="row mb-2">
         
          <div class="col-md-7">
            <span><strong>Status:</strong> ${this.checkStauts(data)}</span>
          </div>
 <div class="col-md-5">
            <span class="label"><strong>Speed:</strong> ${data?.Eventdata?.Speed
      } Km/H</span>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-7">
            <span ><strong>External Voltage:</strong> ${this.checkvoltage(
        data?.Eventdata?.EPC
      )} </span>
          </div>
            <div class="col-md-5">
            <span> <strong>Day Distance:</strong> ${this.dayDistanceValue || 0
      } Km</span>
          </div>
        </div>
         <div class="row mb-2">
          <div class="col-md-7">
            <span>  <strong>IMEI: </strong>${data?.Device?.DeviceImei} </span>
          </div>
            <div class="col-md-5">
            <span> <strong>Odometer:</strong> ${this.updateOdometer(data?.Device?.SoftOdometer)} </span>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-12 location-part">
            <span style="color: black" class="label address">${addressContent}</span>
          </div>
        </div>
        <hr />
        <div class="icon-part">
          <ul class="icon">
            ${generateIcon('fa-snowflake-o', 'AC', data?.Peripherial?.AC)}
            ${generateIcon('fa-map-signs', 'Door', data?.Peripherial?.Door)}
            ${generateIcon(
        'fa-thermometer-empty',
        'Temperature',
        data?.Peripherial?.Temp
      )}
      ${generateIcon(
        'fa-key',
        'Ignition',
        data?.Peripherial?.ACC,
        !data?.Peripherial?.hasOwnProperty('ACC')
      )}
      ${generateIcon(data?.Peripherial?.Relay == 0 ? 'fa-lock-open':'fa-lock', 'Relay', data?.Peripherial?.Relay)}
            ${generateIcon(
        'fa-location-dot',
        'GPS',
        data?.Eventdata?.GpsStatus
      )}
            ${generateIcon('fa-plug', 'Power', data?.Eventdata?.EPC)}
            ${data?.Battery?.status
        ? `<li><a><i class="fa fa-battery-full" style="color:${data.Battery.color} !important"></i><br/><span class="live-value" style="color:black !important">${data.Battery.status}</span></a></li>`
        : ''
      }
            <li><a  id="geofance" title="Geofance" style="cursor:pointer"><i class="fa fa-map-o" ></i><br/><span class="live-value" style="color:black !important">Geofance</span></a></li>
            <li><a  id="play" title="Live" style="cursor:pointer"><i class="fa fa-circle-play" ></i><br/><span class="live-value" style="color:black !important">Live</span></a></li>
            <li><a  id="replay" title="Replay" style="cursor:pointer"><i class="fa fa-undo" ></i><br/><span class="live-value" style="color:black !important">Replay</span></a></li>
          </ul>
        </div>
      </div>`;

    const generateIcon = (icon: string, label: string, status: number, noData = false) => {
      if (icon === 'fa-key') {
        if (status === null || status === 0) {
          return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
        }
        if (status === 1) {
          return `<li><a><i class="fa ${icon}" style="color:green !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
        }
      }
      if(icon === 'fa-lock' || icon === 'fa-lock-open'){
        if (status === null) {
          return `<li><a><i class="fa ${icon}" style="color:gray !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
        }
        if (status === 0) {
          return `<li><a><i class="fa ${icon}" style="color:green !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
        }
        if (status === 1) {
          return `<li><a><i class="fa ${icon}" style="color:orange !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
        }
        if (status === 2) {
          return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
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

    const initialContent = generateContent('Address is Loading...');

    if (!marker.infoWindow) {
      marker.infoWindow = new google.maps.InfoWindow();
      marker.infoWindow.addListener('domready', () => {
        const geofanceLink = document.getElementById('geofance');
        const playLink = document.getElementById('play');
        const replayLink = document.getElementById('replay');

        if (geofanceLink) {
          geofanceLink.addEventListener(
            'click',
            this.handleGeofanceClick.bind(this)
          );
        }
        if (playLink) {
          playLink.addEventListener('click', this.handlePlayClick.bind(this));
        }
        if (replayLink) {
          replayLink.addEventListener('click', (event) => this.handleRePlayClick(event, data));
        }
      });
    }

    marker.infoWindow.setContent(initialContent);
    if (this.isInfoShow) {
      marker.infoWindow.open(this.map, marker);
    }

    google.maps.event.addListener(marker.infoWindow, 'closeclick', () => {
      marker.infoWindowOpen = false;
      this.isInfoShow = false;

      // Unsubscribe from previous subscription
      if (this.livesubscription) {
        this.livesubscription.unsubscribe();
      }

      // Reset latestLat and latestLng
      this.latestLat = null;
      this.latestLng = null;
    });

    if (!marker.infoWindowOpen) {
      google.maps.event.addListener(marker, 'click', () => {
        this.isInfoShow = true;
        marker.infoWindow.open(this.map, marker);
      });
    }

    this.livesubscription = this.getLiveAddressLocation(address)
      .pipe(
        tap((addressValue) => {
          this.latestLat = address.Lat;
          this.latestLng = address.Lng;
        }),
        switchMap((addressValue) => {
          const addressContent = addressValue ?? 'Address not available';
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
          const truncatedWordsContent = truncateLongWords(addressContent, 20);
          const processedAddress =
            truncatedWordsContent.length > 80
              ? truncatedWordsContent.substring(0, 80) + '...'
              : truncatedWordsContent;

          const updatedContent = generateContent(processedAddress);
          marker.infoWindow.setContent(updatedContent);
          return of(updatedContent);
        }),
        catchError(() => {
          const errorContent = generateContent('Address not available');
          marker.infoWindow.setContent(errorContent);
          return of(errorContent);
        })
      )
      .subscribe();
  }

  formateDateValue(date: any) {
    const formattedDate = this.datePipe.transform(
      date,
      'MMMM dd, yyyy HH:mm:ss'
    );
    return formattedDate;
  }
  liveTime: boolean = false;

  handlePlayClick(event: MouseEvent) {
    event.preventDefault();
    this.vehicleListshow = false;
    this.liveTime = true;
  }

  handleGeofanceClick(event: MouseEvent) {
    event.preventDefault();
    const circleCenter = new google.maps.LatLng(
      this.selectedVehicleValue.Eventdata.Latitude,
      this.selectedVehicleValue.Eventdata.Longitude
    );
    const circleRadiusValue = 30;

    this.drawnCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: circleCenter,
      radius: circleRadiusValue,
    });

    const circleCenterValue = this.drawnCircle.getCenter();
    const circleRadius = this.drawnCircle.getRadius();
    this.createGeofance(
      circleCenterValue,
      circleRadius,
      2,
      this.selectedVehicleValue
    );

    // const drawingManager = new google.maps.drawing.DrawingManager({
    //   drawingMode: null,
    //   polygonOptions: {
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: '#FF0000',
    //     fillOpacity: 0.35
    //   },
    //   circleOptions: {
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: '#FF0000',
    //     fillOpacity: 0.35
    //   }
    // });

    // drawingManager.setMap(this.map);
  }

  handleRePlayClick(event: MouseEvent, vehilce?: any) {
    this.liveData = vehilce
    let url = `/user/tracking/replay/${this.liveData?.Device?.Id}`;
    this.router.navigateByUrl(url);
  }

  createGeofance(
    circleCenterValue: any,
    circleRadius: any,
    type: any,
    data: any
  ) {
    let payload = {
      CustomerId: 0,
      GeomType: type,
      Id: 0,
      Name: data?.Device?.VehicleNo,
      Points: this.modifycordinate(circleCenterValue),
      Radius: circleRadius,
      vechileId:this.confirmedVehicleId,
      Stypes:'geofenceList'
    };

    this.geoservice.createGeofance(payload).subscribe((res: any) => {
      if (res?.body?.StatusCode == 201) {
        this.NotificationService.showInfo(res?.body?.Result?.Data);
        setTimeout(() => {
          this.drawnCircle.setMap(null);
        }, 30000);
      }else if(res?.error?.StatusCode == 404) {
        this.NotificationService.showError(res?.error?.Error?.Data);
      }else{
        this.NotificationService.showError(res?.error?.Error?.Message);
      }
    });
  }

  modifycordinate(value: any) {
    let data: any = [];
    if (Array.isArray(value)) {
      value?.forEach((ele: any) => {
        let latlng = {
          Lat: ele.lat(),
          Lng: ele.lng(),
        };
        data.push(latlng);
      });
      data.push({ Lat: value[0].lat(), Lng: value[0].lng() });
    } else {
      let latlng = {
        Lat: value.lat(),
        Lng: value.lng(),
      };
      data.push(latlng);
    }
    return data;
  }

  showChatBox: boolean = false;

  toggleChat() {
    this.showChatBox = !this.showChatBox;
  }

  getAlert(event: any) {
    this.clearMarkers();
    const mapOptions = {
      center: { lat: event?.Latitude, lng: event?.Longitude },
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    };

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLDivElement,
      mapOptions
    );
    const marker = new google.maps.Marker({
      position: { lat: event?.Latitude, lng: event?.Longitude },
      map: this.map,
    });
    this.marker.push(marker);
  }

  getLocation() {
    const mapOptions = {
      center: { lat: this.lat, lng: this.lng },
      zoom: this.zoom,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Add marker for current location
          this.map = new google.maps.Map(
            document.getElementById('map') as HTMLDivElement,
            mapOptions
          );
          const marker = new google.maps.Marker({
            position: pos,
            map: this.map,
          });
          this.marker.push(marker);

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                this.infoWindow = new google.maps.InfoWindow({
                  content: `<div style="color: white;">${results[0].formatted_address}</div>`,
                });

                marker.addListener('click', () => {
                  this.infoWindow.open(this.map, marker);
                });
              }
            } 
          });

          // Center map on current location
          this.map.setCenter(pos);
        },
        () => {
          // Handle geolocation error
        }
      );
    }
  }

  currentMapType: string = 'terrain';

  changeMapType(mapType: string) {
    switch (mapType) {
      case 'terrain':
        this.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        break;
      case 'satellite':
        this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        break;
      case 'hybrid':
        this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        break;
      case 'roadmap':
        this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        break;
      default:
        console.error('Invalid map type');
        break;
    }

    this.currentMapType =
      mapType === this.currentMapType
        ? this.map.setMapTypeId(google.maps.MapTypeId.TERRAIN)
        : mapType;
  }

  trafficLayer!: google.maps.TrafficLayer;

  toggleTrafficMap(event: any) {
    if (this.trafficLayer && this.trafficLayer.getMap()) {
      this.trafficLayer.setMap(null);
    } else {
      this.trafficLayer = new google.maps.TrafficLayer();
      this.trafficLayer.setMap(this.map);
    }
  }

  getAddressData(event: any) {
    const placeName = event;
    const apiKey = 'AIzaSyCWvUzk2vVzV_jpGBAV4AxwvyMn47O3ekQ';
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${placeName}&key=${apiKey}`;

    this.http.get(apiUrl).subscribe((data: any) => {
      const location = data.results[0]?.geometry?.location;
      this.map.setCenter(location);
      this.map.setZoom(17);

      const marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Your Place Name',
      });
    });
  }

  addressValue(event: any) {
    if (event?.type == 'searchLocation') {
      this.getLocation();
    }
  }

  closeTab() {
    this.confirmedVehicleId = null;
    this.liveData = null;
    this.vehicleData = [];
    this.infoVehicleWindows = [];

    if (this.marker) {
      this.marker.forEach((marker: any) => {
        marker.setMap(null);
      });
      this.marker = [];
    }

    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
    const marker = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: this.map,
      icon: {
        url: '',
        scaledSize: new google.maps.Size(30, 30),
      },
    });
    this.map.setZoom(10)
    this.marker.push(marker);

    this.subscription?.unsubscribe();
    this.vehicleListshow = true;
    this.liveTime = false;
    this.getVehicleData()
  }

  labelshow(event: any) {
    if (event == true) {
      const xsmall = document.querySelectorAll('.map-label');
      xsmall.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.display = 'block';
      });
    } else if (event == false) {
      const xsmall = document.querySelectorAll('.map-label');
      xsmall.forEach((element) => {
        const elem = element as HTMLElement;
        elem.style.display = 'none';
      });
    }
  }
  checkvoltage(value: any) {
    if (value === 0 || value === undefined || value === null) {
      return 'Not Connected';
    } else {
      return 'Connected';
    }
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

  selectVehiclesPlot(event: any) {
    this.confirmedVehicleId = null;
    this.liveData = null;
    this.vehicleData = [];
    this.infoVehicleWindows = [];
    if (this.markers) {
      this.markers.forEach((marker: any) => {
        marker.setMap(null);
      });
      this.markers = [];
    }
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
    if (this.marker) {
      this.marker.forEach((marker: any) => {
        marker.setMap(null);
      });
      this.marker = [];
    }

    const marker = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: this.map,
      icon: {
        url: '',
        scaledSize: new google.maps.Size(30, 30),
      },
    });
    this.marker.push(marker);
    this.map.setZoom(10)
  }
}
