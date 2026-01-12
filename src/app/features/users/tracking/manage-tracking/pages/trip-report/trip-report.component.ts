import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TrackingService } from '../../services/tracking.service';
import { CommonService } from 'src/app/features/shared/services/common.service';

@Component({
  selector: 'trip-report',
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.scss']
})
export class TripReportComponent {
  @Input() tripReport: any;
  @Input() tripType:any
  columns :any;
  selectedIndex: number | null = null;
  selectvalue: boolean = false
  @Output() addressSelected = new EventEmitter<any>();
  loadingIndices: { [key: number]: boolean } = {};
  constructor(
    private trackService: TrackingService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.setInitalValue();
    this.selectvalue =  this.tripType    
  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectvalue =  false;
    this.selectedStartIndexes = [];
    this.startAddresses = [];
    this.selectedEndIndexes = [];
    this.endAddresses = [];    
    if (changes['tripReport'] && this.tripReport?.Points) {
      this.fetchAddresses();
    }
  }

  fetchAddresses() {
    this.tripReport.Points.forEach((trip: any, i: number) => {
      this.viewAddress('start', trip.Start, i);
      this.viewAddress('end', trip.End, i);
    });
  }

  setInitalValue() {
    this.columns = [
      {key: 'AVG. SPEED', value: 'AVG. SPEED'},
      {key: 'DURATION', value: 'DURATION'},
      {key: 'MAX SPPED', value: 'MAX SPPED'},
      {key: 'DISTANCE', value: 'DISTANCE'},
    ]
  }

  selectedStartIndexes: number[] = [];
  startAddresses: string[] = [];
  selectedEndIndexes: number[] = [];
  endAddresses: string[] = [];

  viewAddress(type: 'start' | 'end', address: any, i: number) {    
    this.loadingIndices[i] = true;    
    if (type === 'start') {
      if (!this.selectedStartIndexes.includes(i)) {
        this.selectedStartIndexes.push(i);
        this.startAddresses[i] = '';
        this.commonService.getAddressValue(address).subscribe(
          (data: any) => {
            this.startAddresses[i] = data;
            this.loadingIndices[i] = false;
            this.cdr.detectChanges();  // Manually trigger change detection
          },
          (error) => {
            console.error('Error fetching start address:', error);
            this.startAddresses[i] = 'Failed to fetch address';
            this.loadingIndices[i] = false;
            this.cdr.detectChanges();  // Ensure change detection
          }
        );
      }
    } else {
      if (!this.selectedEndIndexes.includes(i)) {
        this.selectedEndIndexes.push(i);
        this.endAddresses[i] = '';
        this.commonService.getAddressValue(address).subscribe(
          (data: any) => {
            this.endAddresses[i] = data;
            this.loadingIndices[i] = false;
            this.cdr.detectChanges();  // Manually trigger change detection
          },
          (error) => {
            console.error('Error fetching end address:', error);
            this.endAddresses[i] = 'Failed to fetch address';
            this.loadingIndices[i] = false;
            this.cdr.detectChanges();  // Ensure change detection
          }
        );
      }
    }
  }
  

viewAddressemit(start: any, end: any, i:any, trip:any): void {  
  this.selectedIndex = i;
  const addressData = {
      start: start,
      end: end
  };
  this.selectvalue = true;  
  this.addressSelected.emit({"add" : addressData, trip:trip, selectvalue: this.selectvalue,distance:trip?.Distance});
}
}
