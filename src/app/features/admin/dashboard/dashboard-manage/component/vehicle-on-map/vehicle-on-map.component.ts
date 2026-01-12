import { ChangeDetectorRef, Component } from '@angular/core';
import { EMPTY, Subject, Subscription, from, interval, switchMap, takeUntil, tap, timer } from 'rxjs';
import { CommonService } from 'src/app/features/shared/services/common.service';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
@Component({
  selector: 'vehicle-on-map',
  templateUrl: './vehicle-on-map.component.html',
  styleUrls: ['./vehicle-on-map.component.scss']
})
export class VehicleOnMapComponent {
  map: any;
  marker: google.maps.Marker[] = [];
  lat = 28.5851;
  lng = 77.3116;
  zoom = 4;
  vehilceOnMapdata: any;
  markers: google.maps.Marker[] = [];
  livemap: any = [];
  polyline: google.maps.Polyline | any;
  liveData: any;
  liveSubscription: Subscription | any;
  private liveUnsubscribe$ = new Subject<void>();
  countdown: number | undefined;
  counter: number = 10;
  counterInterval: any = null;
  historyData: any;
  selectedVehicleData: any


  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private adminService: AdminDashboardService

  ) { };

  ngOnInit() {
    this.initializeMap(this.lat, this.lng, this.zoom);
  }

  // ngAfterViewInit() {
  //   this.initializeMap(this.lat, this.lng, this.zoom);
  // }

  initializeMap(lat: any, long: any, zoomvalue: any) {
    const mapOptions = {
      center: { lat: lat, lng: long },
      zoom: zoomvalue,
      mapTypeId: google.maps.MapTypeId.TERRAIN 
    };
  
    this.map = new google.maps.Map(document.getElementById('map') as HTMLDivElement, mapOptions);
    this.map.setOptions({
      mapTypeControl: false 
    });
  
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

  confirm(event: any) {
    if (!event || event == null) {
      this.clearMarkers();
      return; 
    }
    this.vehilceOnMapdata = null
    this.vehilceOnMapdata = event;
    this.plotVehicleonMap()
  }
  private destroy$ = new Subject<void>();

  plotVehicleonMap() {
    let openInfoWindow: google.maps.InfoWindow | null = null;
    let focusMarkerIndex = 0;
    let mapDragged = false;
    const vehicleObs$ = from(this.vehilceOnMapdata);
    vehicleObs$.pipe(
      switchMap((vehicle: any, index: number) => {
        if (!vehicle?.Eventdata) {
          return EMPTY;
        }

        const canvas = document.createElement('canvas');
        const context: any = canvas.getContext('2d');

        const img = new Image();
        img.src = this.onCheckVehicleDevice(vehicle);
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

          if (this.markers[index]) {
            const newPosition = new google.maps.LatLng(vehicle?.Eventdata?.Latitude, vehicle?.Eventdata?.Longitude);
            this.markers[index].setPosition(newPosition);
            this.markers[index].setIcon(icon);
          } else {
            const marker = new google.maps.Marker({
              position: { lat: vehicle?.Eventdata?.Latitude, lng: vehicle?.Eventdata?.Longitude },
              map: this.map,
              icon: icon,
              label: {
                text: `${vehicle?.Device?.VehicleNo}`,
                className: "map-label"
              },
              optimized: true,
            });

            marker.addListener('click', () => {
              if (openInfoWindow) {
                openInfoWindow.close();
              }
              const address = {
                Lat: vehicle?.Eventdata?.Latitude,
                Lng: vehicle?.Eventdata?.Longitude
              }

              this.commonService.getAddressValue(address).subscribe((res: any) => {
                const addressData = res;
                const infoWindowContent = `
        <div class="live-data" appCustomClick>
              <div class="row mb-2">
               <div class="col-md-6">
                  <span>${vehicle?.Device?.VehicleNo ? vehicle?.Device?.VehicleNo : 'NA'}</span>
               </div>
               <div class="col-md-6">
                  <span>Time: ${vehicle?.Eventdata ? this.formateDateValue(vehicle?.Eventdata.Timestamp) : ''}</span>
               </div>
              </div>
              <div class="row mb-2">
               <div class="col-md-6">
                  <span>Status: ${this.checkStauts(vehicle)}</span>
               </div>
               <div class="col-md-6">
                  <span>Today Distance: ${vehicle?.Eventdata?.DayDistance} Km </span>
               </div>
              </div>
            <div class="row mb-2">
            <div class="col-md-6">
            <span>External Power: ${vehicle?.Eventdata?.EPC == 0 ? 'Disconnected' : 'Connected'} </span>
            </div>
            </div>
              <div class="row mb-2">
               <div class="col-md-12">
                  <span class="label"> ${addressData}</span>
               </div>
              </div>
      
              <div class="icon-part mb-1">
               <ul class="icon">
               ${vehicle?.Peripherial?.AC !== null ?
                    this.selectedVehicleData?.Peripherial?.AC === 0 ?
                      '<li><a ><i class="fa fa-snowflake-o" style="color:red !important"></i><br/><span style="color:black !important">AC</span></a></li>' :
                      this.selectedVehicleData?.Peripherial?.AC === 1 ?
                        '<li><a ><i class="fa fa-snowflake-o" style="color:black !important"></i><br/><span style="color:black !important">AC</span></a></li>' :
                        '' :
                    ''
                  }
              ${vehicle?.Eventdata?.DI1 == 1 ?
                    '<li><a ><i class="fa fa-bolt" style="color:green !important"  aria-hidden="true"></i><br/><span style="color:black !important">Ignition</span></a></li>' :
                    '<li><a ><i class="fa fa-bolt" style="color:red !important" aria-hidden="true"></i><br/><span style="color:black !important">Ignition</span></a></li>'
                  } 
                  ${vehicle?.Eventdata?.GpsStatus == 1 ?
                    '<li><a ><i class="fa fa-map-marker" style="color:green !important" aria-hidden="true"></i><br/><span style="color:black !important">GPS</span></a></li>' :
                    '<li><a ><i class="fa fa-map-marker" style="color:red !important" aria-hidden="true"></i><br/><span style="color:black !important">GPS</span></a></li>'
                  }

        ${vehicle?.Eventdata?.EPC == 1 ?
                    '<li><a ><i class="fa fa-plug" style="color:green !important" aria-hidden="true"></i><br/><span style="color:black !important">Power</span></a></li>' :
                    '<li><a ><i class="fa fa-plug" style="color:red !important" aria-hidden="true"></i><br/><span style="color:black !important">Power</span></a></li>'
                  }

                  ${vehicle?.Battery?.status ?
                    `<li><a ><i class="fa fa-battery-full" style="color: ${vehicle?.Battery?.color} !important;""  aria-hidden="true"></i><br/><span style="color:black !important">${vehicle?.Battery?.status}</span></a></li>` :
                    ``
                  }
                 
               </ul>
            </div>
      
      
            </div>
        `;
                const infoWindow = new google.maps.InfoWindow({
                  content: infoWindowContent,
                });
                infoWindow.open(this.map, marker);
                openInfoWindow = infoWindow;
                setTimeout(() => {
                  const dynamicPadding = document.querySelectorAll(".gm-style-iw.gm-style-iw-c ");
                  dynamicPadding.forEach((element) => {
                    const elem = element as HTMLElement;
                    // let colour = this.getVehicleColor(vehicle);
                    // elem.style.backgroundColor = colour;
                  });
                }, 100);
              });
            });

            this.markers.push(marker);
          }
        };

        return interval(1000).pipe(takeUntil(this.destroy$));
      }),
    ).subscribe(() => {
      if (!mapDragged) { 
        const focusMarkerPosition = new google.maps.LatLng(
          this.vehilceOnMapdata[focusMarkerIndex]?.Eventdata?.Latitude,
          this.vehilceOnMapdata[focusMarkerIndex]?.Eventdata?.Longitude
        );      
        this.map?.setCenter(focusMarkerPosition);
        // this.map.setZoom(7);
        this.cdr.detectChanges();
      }
    });

    google.maps.event.addListener(this.map, 'dragstart', () => {
      mapDragged = true;       
    });
  }

  clearMarkers() {
    // Remove all markers from the map
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    // Clear the markers array
    this.markers = [];
  }

  onCheckVehicleDevice(device: any) {
    if (device?.Device?.VehicleType == 1) {
      if (device?.Status === 1 && device?.SubStatus === 1) {
        return 'assets/drawable/marker_car_run.png';
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

  formateDateValue(date: any) {
    let dateObj = new Date(date);
    let formattedDate = dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear() + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds();;
    return formattedDate
  }

  checkStauts(vehicle: any) {
    if (vehicle) {
      let status = vehicle?.StatusDuration?.split(' ')
      let newData: any = status ? `${status[0]}(${vehicle?.Eventdata?.Speed})km/h` : ''
      return newData
    }
  }

  selectedVehicle(event: any) {
    this.liveData = event
    if (this.polyline) {
      this.livemap = []
      this.polyline.setMap(null);
      this.polyline = null;
    }
    this.liveTracking(event)
  }

  liveTracking(event: any) {
    this.unsubscribeLiveTracking();
    this.liveUnsubscribe$.next();
    this.liveUnsubscribe$.complete();

    this.liveSubscription = timer(0, 10000).pipe(
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
        return this.adminService.liveVehicle(payload);
      }),
      takeUntil(this.liveUnsubscribe$)
    )
      .subscribe((res: any) => {
        let newLocation = res?.body?.Result?.Data;
        this.historyData = res?.body?.Result?.Data;
        if (!newLocation || !newLocation?.Eventdata || newLocation?.Eventdata == null) {
          return;
        }
        if (newLocation) {
          const latestLatLng = new google.maps.LatLng(newLocation?.Eventdata?.Latitude, newLocation?.Eventdata?.Longitude);
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

  unsubscribeLiveTracking() {
    if (this.liveSubscription) {
      this.liveSubscription.unsubscribe();
      this.liveSubscription = undefined;
    }
    this.liveUnsubscribe$.next();
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
      if (this.marker) {
        this.marker.forEach((marker: any) => {
          marker.setPosition(latestLatLng);
          marker.setIcon(icon);
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
        });
        newMarker.infoWindowOpen = true;
        this.openInfo(newMarker, data);
        this.marker = [newMarker];
      }
    }
  }

  openInfo(marker: google.maps.Marker | any, data: any) {
    const address = {
      Lat: data.Eventdata?.Latitude,
      Lng: data.Eventdata?.Longitude
    };
    this.commonService.getAddressValue(address).subscribe((res: any) => {
      const addressData = res;
      const infoWindowContent = `
        <div class="live-data" appCustomClick>
              <div class="row mb-2">
               <div class="col-md-6">
                  <span>${data?.Device?.VehicleNo ? data?.Device?.VehicleNo : 'NA'}</span>
               </div>
               <div class="col-md-6">
                  <span>Time: ${data?.Eventdata ? this.formateDateValue(data.Eventdata.Timestamp) : ''}</span>
               </div>
              </div>
              <div class="row mb-2">
               <div class="col-md-6">
                  <span>Status: ${this.checkStauts(data)}</span>
               </div>
               <div class="col-md-6">
                  <span>Today Distance: ${data?.Eventdata?.DayDistance} Km </span>
               </div>
              </div>
            <div class="row mb-2">
            <div class="col-md-6">
            <span>External Power: ${data?.Eventdata?.EPC == 0 ? 'Disconnected' : 'Connected'} </span>
            </div>
            </div>
              <div class="row mb-2">
               <div class="col-md-12">
                  <span class="label"> ${addressData}</span>
               </div>
              </div>
      
              <div class="icon-part mb-1">
               <ul class="icon">
               ${data?.Peripherial?.AC !== null ?
          this.selectedVehicleData?.Peripherial?.AC === 0 ?
            '<li><a ><i class="fa fa-snowflake-o" style="color:red !important"></i><br/><span style="color:black !important">AC</span></a></li>' :
            this.selectedVehicleData?.Peripherial?.AC === 1 ?
              '<li><a ><i class="fa fa-snowflake-o" style="color:black !important"></i><br/><span style="color:black !important">AC</span></a></li>' :
              '' :
          ''
        }
              ${data?.Eventdata?.DI1 == 1 ?
          '<li><a ><i class="fa fa-bolt" style="color:green !important"  aria-hidden="true"></i><br/><span style="color:black !important">Ignition</span></a></li>' :
          '<li><a ><i class="fa fa-bolt" style="color:red !important" aria-hidden="true"></i><br/><span style="color:black !important">Ignition</span></a></li>'
        } 
                  ${data?.Eventdata?.GpsStatus == 1 ?
          '<li><a ><i class="fa fa-map-marker" style="color:green !important" aria-hidden="true"></i><br/><span style="color:black !important">GPS</span></a></li>' :
          '<li><a ><i class="fa fa-map-marker" style="color:red !important" aria-hidden="true"></i><br/><span style="color:black !important">GPS</span></a></li>'
        }

        ${data?.Eventdata?.EPC == 1 ?
          '<li><a ><i class="fa fa-plug" style="color:green !important" aria-hidden="true"></i><br/><span style="color:black !important">Power</span></a></li>' :
          '<li><a ><i class="fa fa-plug" style="color:red !important" aria-hidden="true"></i><br/><span style="color:black !important">Power</span></a></li>'
        }

                  ${data?.Battery?.status ?
          `<li><a ><i class="fa fa-battery-full" style="color: ${data?.Battery?.color} !important;""  aria-hidden="true"></i><br/><span style="color:black !important">${data?.Battery?.status}</span></a></li>` :
          ``
        }
                  <li>
                     <a  id="play">
                        <i class="fa fa-play" style="cursor:pointer"  aria-hidden="true"></i> <br /><span style="color:black !important">Live</span>
                     </a>
                  </li>
                  <li >
                  <a href="/tracking/replay/${data?.Device?.Id}" style="outline: none;">
                     <i class="fa fa-undo" aria-hidden="true"></i> <br /><span style="color:black !important">Replay</span>
                  </a>
               </li>
               </ul>
            </div>
      
      
            </div>
        `;

      if (!marker.infoWindow) {
        marker.infoWindow = new google.maps.InfoWindow();
      }

      marker.infoWindow.setContent(infoWindowContent);

      marker.infoWindow.open(this.map, marker);

      google.maps.event.addListener(marker.infoWindow, 'closeclick', () => {
        marker.infoWindowOpen = false;
      });

      if (!marker.infoWindowOpen) {
        google.maps.event.addListenerOnce(marker, 'click', () => {
          this.openInfo(marker, data);
        });
      }
    });
  }

  updatePolylines() {
    const path = this.livemap.map((bus: any) => ({
      lat: bus.lat,
      lng: bus.lon
    }));

    const flagMarker = new google.maps.Marker({
      position: path[0],
      map: this.map,
      icon: {
        url: 'assets/images/flag.png',
        scaledSize: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 20),
      }
    });


    const lastLocation = this.livemap[this.livemap.length - 1];
    const lastLocationLatLng = new google.maps.LatLng(lastLocation.lat, lastLocation.lon);
    if (this.map.getZoom() < 15) {
      this.map.setCenter(lastLocationLatLng);
      this.map.setZoom(15);
    }

    this.polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: 'black',
      strokeOpacity: 2.0,
      strokeWeight: 2,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 2,
            fillColor: 'black',
            fillOpacity: 1.0
          },
          offset: '100%',
          repeat: '100px'
        }
      ]
    });

    this.polyline.setMap(this.map);
  }

}
