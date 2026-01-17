import { ChangeDetectorRef, Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { EMPTY, Observable, Subject, Subscription, catchError, filter, from, interval, map, of, switchMap, take, takeUntil, tap, timer } from 'rxjs';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { CommonService } from 'src/app/features/shared/services/common.service';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { NavigationEnd, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'new-vehicle-on-map',
  templateUrl: './new-vehicle-on-map.component.html',
  styleUrls: ['./new-vehicle-on-map.component.scss']
})
export class NewVehicleOnMapComponent {
  map: any;
  markers: google.maps.Marker[] = [];
  lat = 28.5851;
  lng = 77.3116;
  zoom = 10;
  selectedCustomer: any;
  spinnerLoading: boolean = false;
  vehicleData: any;
  swiperData: any;
  subscription: Subscription | any;
  private unsubscribe$ = new Subject<void>();
  liveData: any;
  infoVehicleWindows: google.maps.InfoWindow[] = [];
  clickedMarker: google.maps.Marker | null = null;
  clickedInfoWindow: google.maps.InfoWindow | null = null;
  lastKnownAddresses = 'Address is Loading...';
  private destroy$ = new Subject<void>();
  isInfoShow: boolean = true;
  livemap: any;
  polyline: google.maps.Polyline | any;
  confirmedVehicleId: string | null = null;
  marker: google.maps.Marker[] = [];
  vehicleListshow: boolean = true;
  countdown: number | undefined;
  counter: number = 10;
  counterInterval: any = null;
  vehicleDatacount: any;
  selectType: boolean = false;
  selectedStatus: any;
  vehilceOnMapdata: any;
  data: any;
  private unsubscribeRouteChange$ = new Subject<void>();
  dayDistanceValue: any;


  constructor(
    private dashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    private storageService: StorageService,
    private router: Router,
    private renderer: Renderer2,
    private datePipe:DatePipe,
    
  ) { 
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeRouteChange$)
    ).subscribe((event: any) => {
      this.unsubscribe();
    });
  }

  ngOnInit() {
    if(!this.selectType) {
      this.initializeMap(this.lat, this.lng, this.zoom);
    }
  }

  ngOnDestroy() {
    this.unsubscribeRouteChange$.next();
    this.unsubscribeRouteChange$.complete();
    this.subscription?.unsubscribe();
  }

  initializeMap(lat: any, long: any, zoomvalue: any) {
    const mapOptions = {
      center: { lat: lat, lng: long },
      zoom: zoomvalue,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoomControl: true, // Enable zoom control
      mapTypeControl: false, // Disable map type control
      streetViewControl: false, // Disable Street View control
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.DEFAULT,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      }
    };
  
    this.map = new google.maps.Map(document.getElementById('new-map') as HTMLDivElement, mapOptions);
  
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

  selectCustomer(customer: any) {
    if(!customer?.selectcus) {
      this.subscription?.unsubscribe();  
    }
    this.selectType = customer?.customer?.type;
    
    if(this.selectType) {      
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
    }
    this.clearMarkers()
    this.unsubscribe();
    this.isInfoShow = false
    this.confirmedVehicleId = null;
    this.liveData = null;
    this.infoVehicleWindows = [];
    this.vehicleListshow = true;
    this.liveTime = false;
    this.vehicleData = [];
    this.data =[];
    this.vehicleDatacount = []
    this.selectedCustomer = customer?.customer?.selectcus; 
    if (this.selectedCustomer) {
      this.storageService.setItem('status','All' )
      this.getVehicleData(this.selectedCustomer);
    }
  }

  clearMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
    this.infoVehicleWindows = [];
    this.vehilceOnMapdata = [];
    if (this.polyline) {
      this.polyline.setMap(null)
      this.polyline = null;
    }
  }

  getVehicleData(id: any) {
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
      switchMap(() => this.dashboardService.customerVehicle(id)),
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
        this.plotVehicleonMap();
      })
    ).subscribe(
      () => {},
      (error) => {
        console.error('Error fetching vehicle data:', error);
        this.spinnerLoading = false;
      }
    );
    
    // Set the flag to detect page refresh on page load
    localStorage.setItem('isPageRefreshed', 'true');
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
      this.vehicleData = data.filter((res: any) =>  res?.isexpiredsoon === 1);      
    } else if (this.selectedStatus === 'Expired') {
      this.vehicleData = data.filter((res: any) => res?.isexpired === 1);
    }  else if (
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

  plotVehicleonMap() {    
    if (this.liveData) {
      return;
    }
    const vehicleObs$ = from(this.vehilceOnMapdata);

    vehicleObs$.pipe(
      switchMap((vehicle: any, index: number) => {
        if (!vehicle?.Eventdata || (!vehicle?.Eventdata?.Latitude && !vehicle?.Eventdata?.Longitude)) {
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
          const generateIcon = (
            icon: string,
            label: string,
            status: number,
            noData = false
          ) => {
            if (noData)
              return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
            if (status === 0)
              return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
            if (status === 1)
              return `<li><a><i class="fa ${icon}" style="color:green !important"></i><br/><span class="live-value"  style="color:black !important">${label}</span></a></li>`;
            return '';
          };
          if (existingMarkerIndex !== -1) {
            this.markers[existingMarkerIndex].setIcon(icon);
            this.markers[existingMarkerIndex].setPosition(newPosition);
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

  findExistingMarkerIndex(vehicleNo: string): any {
    return this.markers.findIndex(marker => marker.getLabel()?.text === vehicleNo);
  }

  getAddressLocation(address: any) {
    this.commonService.getAddressInfoDetail(address).subscribe((res: any) => {
      if (res) {
        this.lastKnownAddresses = res;
      }
    });
  }

  // formateDateValue(date: any) {
  //   //   alert(date)
  //   let dateObj = new Date(date);
  //   let formattedDate = dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear() + ' ' + String(dateObj.getHours()).padStart(2, '0') + ':' + String(dateObj.getMinutes()).padStart(2, '0');;
  //   return formattedDate
  // }

  formateDateValue(date: any) {
    const formattedDate = this.datePipe.transform(
      date,
      'MMMM dd, yyyy HH:mm:ss'
    );
    return formattedDate;
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

    const formattedTime = this.commonService.formatTimeValue(parts[2]);
    return `${parts[0]}(${formattedTime})`;
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
    return "NA";
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
      this.closeAllInfoWindows();
   
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
      const address = {
        Lat: vehicle?.Eventdata?.Latitude,
        Lng: vehicle?.Eventdata?.Longitude,
      };

      this.clickedMarker = marker;
      this.getdayDistanceInfo(vehicle?.Device?.Id)
        .then(dayDistance => {
          this.dayDistanceValue = dayDistance
        })
      this.clickedInfoWindow = infoWindow;

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
    this.markers.forEach((marker:any) => {
      bounds.extend(marker.getPosition());
    });
    this.map.fitBounds(bounds);
    this.map.setZoom(10);
  }

  handlePlayClickData(event: MouseEvent, vehicle: any) {
    this.liveData = vehicle
    this.selectVehicle(this.liveData)
    event.preventDefault();
    this.vehicleListshow = false;
    this.liveTime = true;
  }


  // generateInfoWindowContent(vehicle: any, address: string) {
  //   const truncateLongWords = (text: string, maxLength: number) => {
  //     return text
  //       .split(' ')
  //       .map((word) => {
  //         return word.length > maxLength
  //           ? word.substring(0, maxLength) + '...'
  //           : word;
  //       })
  //       .join(' ');
  //   };
  //   const generateIcon = (icon: string, label: string, status: number, noData = false) => {
  //     if (icon === 'fa-key') {
  //       if (status === null || status === 0) {
  //         return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
  //       }
  //       if (status === 1) {
  //         return `<li><a><i class="fa ${icon}" style="color:green !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
  //       }
  //     }
  //     if (noData) {
  //       return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
  //     }
  //     if (status === 0) {
  //       return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
  //     }
  //     if (status === 1) {
  //       return `<li><a><i class="fa ${icon}" style="color:green !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
  //     }
  //     return '';
  //   };

  //   const truncatedWordsContent = truncateLongWords(address, 20);
  //   const processedAddress =
  //     truncatedWordsContent.length > 80
  //       ? truncatedWordsContent.substring(0, 80) + '...'
  //       : truncatedWordsContent;
  //   return `
  //     <div class="">
  //       <div class="">
  //         <div class="live-data pl-2 mt-1">
  //           <div class="row mb-2">
  //             <div class="col-md-12 mb-2">
  //               <span style="font-size:16px" class="label"><strong>${vehicle?.Device?.VehicleNo
  //     }</strong></span>
  //             </div>
  //             <div class="col-md-12">
  //           <span> <strong>Date: </strong> ${vehicle?.Eventdata
  //       ? this.formateDateValue(vehicle.Eventdata.GpsTimestamp)
  //       : ''
  //     }</span>
  //             </div>
  //           </div>
  //           <div class="row mb-2">
  //             <div class="col-md-7">
  //               <span><strong>Status:</strong> ${this.checkStauts(
  //       vehicle
  //     )}</span>
  //             </div> 
  //              <div class="col-md-5">
  //               <span ><strong>Speed: </strong>${vehicle?.Eventdata && vehicle?.Eventdata?.Speed ? vehicle?.Eventdata?.Speed : 0
  //     } Km/H</span>
  //             </div>             
  //           </div>
  //           <div class="row mb-2">
  //             <div class="col-md-7">
  //               <span>  <strong>IMEI: </strong>${vehicle?.Device?.DeviceImei
  //     } </span>
  //             </div>
  //             <div class="col-md-5">
  //               <span> <strong>Day Distance:</strong> ${this.dayDistanceValue || 0
  //     } Km</span>
  //             </div>
  //           </div>
           
  //           <div class="row mb-2">
  //             <div class="col-md-12 location-part">
  //               <span style="color: black" class="label"><strong>Address:</strong> ${processedAddress}</span>
  //             </div>
  //           </div>
  //           <hr />
  //       <div class="icon-part">
  //         <ul class="icon">
  //           ${generateIcon('fa-snowflake-o', 'AC', vehicle?.Peripherial?.AC)}
  //           ${generateIcon('fa-map-signs', 'Door', vehicle?.Peripherial?.Door)}
  //           ${generateIcon(
  //       'fa-thermometer-empty',
  //       'Temperature',
  //       vehicle?.Peripherial?.Temp
  //     )}         
  //        ${generateIcon(
  //       'fa-key',
  //       'Ignition',
  //       vehicle?.Peripherial?.ACC
  //     )}
  //           ${generateIcon(
  //       'fa-location-dot',
  //       'GPS',
  //       vehicle?.Eventdata?.GpsStatus
  //     )}
  //           ${generateIcon('fa-plug', 'Power', vehicle?.Eventdata?.EPC)}
  //           ${vehicle?.Battery?.status
  //       ? `<li><a><i class="fa fa-battery-full" style="color:${vehicle.Battery.color} !important"></i><br/><span class="live-value" style="color:black !important">${vehicle.Battery.status}</span></a></li>`
  //       : ''
  //     }
  //           <li><a  id="geofanceId" title="Geofance" style="cursor:pointer"><i class="fa fa-map-o" ></i><br/><span class="live-value" style="color:black !important">Geofance</span></a></li>
  //           <li><a  id="playId" title="Live" style="cursor:pointer"><i class="fa fa-circle-play" ></i><br/><span class="live-value" style="color:black !important">Live</span></a></li>
  //           <li><a  id="replayId" title="Replay" style="cursor:pointer"><i class="fa fa-undo" ></i><br/><span class="live-value" style="color:black !important">Replay</span></a></li>
  //         </ul>
  //       </div>
  //         </div>
  //       </div>
  //     </div>`;
  // }
  

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
      // if (icon === 'fa-key') {
      //   if (status === null || status === 0) {
      //     return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
      //   }
      //   if (status === 1) {
      //     return `<li><a><i class="fa ${icon}" style="color:green !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
      //   }
      // }
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
              <div class="col-md-12 mb-2">
                <span style="font-size:16px" class="label"><strong>${vehicle?.Device?.VehicleNo
      }</strong></span>
              </div>
              <div class="col-md-12">
            <span> <strong>Date: </strong> ${vehicle?.Eventdata
        ? this.formateDateValue(vehicle.Eventdata.GpsTimestamp)
        : ''
      }</span>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-md-8">
                <span><strong>Status:</strong> ${this.checkStauts(
        vehicle
      )}</span>
              </div> 
               <div class="col-md-4">
                <span ><strong>Speed: </strong>${vehicle?.Eventdata && vehicle?.Eventdata?.Speed ? vehicle?.Eventdata?.Speed : 0
      } Km/H</span>
              </div>             
            </div>
            <div class="row mb-2">
              <div class="col-md-8">
                <span>  <strong>IMEI: </strong>${vehicle?.Device?.DeviceImei
      } </span>
              </div>
              <div class="col-md-4">
                <span> <strong>Day Distance:</strong> ${this.dayDistanceValue || 0
      } Km</span>
              </div>
            </div>
           
            <div class="row mb-2">
              <div class="col-md-12 location-part">
                <span style="color: black" class="label"><strong>Address:</strong> ${processedAddress}</span>
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
        'fa-location-dot',
        'GPS',
        vehicle?.Eventdata?.GpsStatus
      )}
          
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

  selectVehicle(event:any) {
    this.closeAllInfoWindows();
    this.isInfoShow = true;
    this.livemap = [];
    if (this.polyline) {
      this.polyline.setMap(null)
      this.polyline = null;
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
            const latestLatLng = new google.maps.LatLng(vehicle?.Eventdata?.Latitude, vehicle?.Eventdata?.Longitude);
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
            this.updatePolylines()
          }
        }
      });
    }
  }

  updateMarker(latestLatLng: google.maps.LatLng, data: any, prevLatLng?: google.maps.LatLng) {    
    let heading = 0;
    if (prevLatLng) {
      heading = data?.Eventdata?.Heading
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
      context.rotate((data?.Eventdata?.Heading || 0) * Math.PI / 180);
      context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
      context.rotate(-(data?.Eventdata?.Heading || 0) * Math.PI / 180);
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
    }
  }

  getLiveAddressLocation(address: any): Observable<any> {
    return this.commonService.getAddressInfoDetail(address).pipe(
      map((res: any) => res)
    );
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
          <div class="col-md-12 mb-2">
            <span style="font-size:16px"><strong>${data?.Device?.VehicleNo ?? 'NA'
      }</strong></span>
          </div>
          <div class="col-md-12">
            <span> <strong>Date: </strong> ${data?.Eventdata
        ? this.formateDateValue(data.Eventdata.GpsTimestamp)
        : ''
      }</span>
          </div>
        </div>
        <div class="row mb-2">
         
          <div class="col-md-8">
            <span><strong>Status:</strong> ${this.checkStauts(data)}</span>
          </div>
 <div class="col-md-4">
            <span class="label"><strong>Speed:</strong> ${data?.Eventdata && data?.Eventdata?.Speed ? data?.Eventdata?.Speed : 0
            } Km/H</span>
          </div>
        </div>
        <div class="row mb-2">
           <div class="col-md-8">
            <span>  <strong>IMEI: </strong>${data?.Device?.DeviceImei} </span>
          </div>
            <div class="col-md-4">
            <span> <strong>Day Distance:</strong> ${this.dayDistanceValue || 0
      } Km</span>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-12 location-part">
            <span style="color: black" class="label address"> <strong>Address: </strong>${addressContent}</span>
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
        'fa-location-dot',
        'GPS',
        data?.Eventdata?.GpsStatus
      )}
            
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
      // if (icon === 'fa-key') {
      //   if (status === null || status === 0) {
      //     return `<li><a><i class="fa ${icon}" style="color:red !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
      //   }
      //   if (status === 1) {
      //     return `<li><a><i class="fa ${icon}" style="color:green !important"></i><br/><span class="live-value" style="color:black !important">${label}</span></a></li>`;
      //   }
      // }
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

        // if (geofanceLink) {
        //   geofanceLink.addEventListener(
        //     'click',
        //     this.handleGeofanceClick.bind(this)
        //   );
        // }
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
  liveTime: boolean = false
 
  handlePlayClick(event: MouseEvent) {
    event.preventDefault();
    this.vehicleListshow = false;
    this.liveTime = true
  }

  handleRePlayClick(event: MouseEvent, vehilce?: any) {
    this.liveData = vehilce
    let url = `admin/history-tracking/${this.liveData?.Device?.Id}`;
    this.router.navigateByUrl(url);
  }

  updatePolylines() {
    const path = this.livemap.map((bus: any) => ({
      lat: bus.lat,
      lng: bus.lon
    }));


    const lastLocation = this.livemap[this.livemap.length - 1];
    const lastLocationLatLng = new google.maps.LatLng(lastLocation.lat, lastLocation.lon);

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

  closeTab(event:any) {
    this.confirmedVehicleId = null;
    this.liveData = null
    this.infoVehicleWindows = [];
    this.vehicleListshow = true;
    this.liveTime = false;
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
    this.getVehicleData(this.selectedCustomer)
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
}
