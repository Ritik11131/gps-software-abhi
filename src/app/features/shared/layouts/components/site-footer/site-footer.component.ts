import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { filter } from 'rxjs';

@Component({
  selector: 'site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.scss'],
})
export class SiteFooterComponent implements OnInit {
  selectedVehicleData: any
  showCardData: boolean = false;
  addressHeight: number = 0;
  project: string = '';
  address: any
  @Output() sliderValueevent = new EventEmitter();
  @Output() changeMap = new EventEmitter();
  @Output() trafficeValue = new EventEmitter();
  @Output() addressValue = new EventEmitter();
  filteredAddresses: any[] = [];
  autocomplete!: google.maps.places.Autocomplete;
  observer!: MutationObserver;
  isSatelliteActive: boolean= false;
  isTrafficActive: boolean = false;

  setData(data: any) {
    this.selectedVehicleData = data

  }
  constructor(private ar: ActivatedRoute,
    private CommonService: CommonService,
    private router: Router 
  ) {
    this.project = this.ar.snapshot?.data['project'];
    

  }
  @ViewChild('searchInput') searchInput!: ElementRef;  pacInput!: ElementRef;
  ngOnInit(): void {
    this.initializeObserver();
    // this.searchValue()
  }

  ngAfterViewInit() {
    this.initializeObserver();
    this.searchValue()
  }

  ngOnDestroy() {
    this.stopObserver();
  }

  searchValue() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.searchInput?.nativeElement,
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
        document.getElementById('map') as HTMLElement,
        {
          center: place.geometry.location,
          zoom: 15
        }
      );
  
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location
      });
  
    });
  
    const dropdownBounds = new google.maps.MVCObject();
    dropdownBounds.set('bounds', new google.maps.LatLngBounds());
  
    this.autocomplete.bindTo('bounds', dropdownBounds);
 
  }

  initializeObserver() {
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const pacContainer = document.querySelector('.pac-container') as HTMLElement;
        if (pacContainer && mutation.target === pacContainer && mutation.attributeName === 'style') {
          this.applyAutocompleteStyles();
        }
      });
    });

    this.observer.observe(document.body, { attributes: true, childList: true, subtree: true });
  }

  stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  applyAutocompleteStyles() {
    const pacContainer = document.querySelector('.pac-container') as HTMLElement;    
    if (pacContainer) {
      pacContainer.style.width = '350px';
      pacContainer.style.position = 'absolute';
      pacContainer.style.left = '576px';
      pacContainer.style.top = '560px';
    }
  }
  change(event: any) {
    this.getCurrentAddres(event)
  }



  toggleStatus() {
    this.showCardData = !this.showCardData;
    this.setAddressHeight();
  }

  setAddressHeight() {
    const addressElement = document.querySelector('.address');
    if (addressElement) {
      this.addressHeight = addressElement.clientHeight;
    }
  }

  fromatTimeValue(time: any) {
    // if (time) {
    //   const parts = time?.split(' ');
    //   let newtime = this.CommonService.formatTimeValue(parts[2])
    //   time = `${parts[0]}(${newtime})`
    // }
    // return time    
    if (!time || !time?.StatusDuration || time?.StatusDuration == null) return;
    if (time && time?.StatusDuration) {
      let status = time?.StatusDuration?.split(' ')
      time = status ? `${status[0]}(${time?.Eventdata?.Speed})km/h` : ''
      return time
    }
  }
  sliderValue = 10;

  increaseValue() {
    if (this.sliderValue < 30) {
      this.sliderValue++;
      this.sliderValueevent.emit(this.sliderValue)
    }
  }

  decreaseValue() {
    if (this.sliderValue > 1) {
      this.sliderValue--;
      this.sliderValueevent.emit(this.sliderValue)
    }
  }

  sliderChange(event: any) {
    this.sliderValue = event.target.value;
    this.sliderValueevent.emit(this.sliderValue)
  }

  satellite(type: any) {
    if (type) {
      this.changeMap.emit(type)
    }
  }

  toggleTraffic() {
    this.trafficeValue.emit('')
  }

  getCurrentAddres(event: any) {
    this.address = event.target.value;
    this.addressValue.emit(this.address)
  }

  toggleBackground(type: string) {
    if (type === 'satellite') {
      this.isSatelliteActive = !this.isSatelliteActive;
    } else if (type === 'traffic') {
      this.isTrafficActive = !this.isTrafficActive;
    }
  }


}
