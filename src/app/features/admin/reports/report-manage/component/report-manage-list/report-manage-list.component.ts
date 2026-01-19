import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonService } from 'src/app/features/shared/services/common.service';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FLOAT } from 'html2canvas/dist/types/css/property-descriptors/float';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LocationInMapComponent } from 'src/app/features/shared/components/location-in-map/location-in-map.component';
import autoTable from 'jspdf-autotable';
import { NotificationService } from 'src/app/features/http-services/notification.service';

interface VehicleData {
  VehicleNo: string;
  // Include other properties relevant to vehicle data here
  StartTime?: Date;
  EndTime?: Date;
  Duration?: string;
  Location?: string;
}
interface Device {
  Device: string;
  Distance: number;
  StartTime?: Date;
  EndTime?: Date;
  Duration: string;
  Location?: string;
}
interface speedData {
  VehicleNo: string;
  Device: string;
  Distance: number;
  StartTime?: Date;
  EndTime?: Date;
  Duration: string;
  Location?: string;
}
interface overspeedData {
  VehicleNo: string;
  StartTime?: Date;
  Location?: string;
}
interface geofence {
  VehicleNo: string;

}
@Component({
  selector: 'app-report-manage-list',
  templateUrl: './report-manage-list.component.html',
  styleUrls: ['./report-manage-list.component.scss']
})
export class ReportManageListComponent {
  @Output() filterPagination = new EventEmitter();
  vehicle: any;
  filterType: any;
  filteredReports: any;
  startAdreess: any;
  endAdress: any;
  endIndex: any;
  startIndex: any;
  tableData: any;
  tableData1: any;
  dateValue: any;
  totalDuration: any;
  totalDistance: any;
  tableData2: any;
  vehicleData: any;
  displayTableSize: any;
  isLocation: any;
  page = 1;
  count = 0;
  tableSize = 50;
  tableSizes = [25, 50, 100, 500, 1000, 'All'];
  daysDifference: any;

  constructor(
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    private notificationService: NotificationService
  ) {}

  setData(data: any, filterType: any, formvalue: any, type: any, isLocation: any) {

    this.isLocation = formvalue?.locationType
    if (formvalue?.toDate && formvalue?.fromDate) {
      const timeDiff = formvalue?.toDate?.getTime() - formvalue?.fromDate?.getTime();
      this.daysDifference = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    }
    if (type == 'Report') {
      this.count = 0
      this.page = 1
    }
    if (filterType == 'GeoFence Report' && data && Array.isArray(data) && data.length > 0) {
      this.count = data[0]?.Points?.[0]?.TotalCount || 0
    }
    this.selectedStartIndexes = [];
    this.selectedEndIndexes = [];
    // Always set vehicle, even if null/empty, so table structure is shown
    this.vehicle = data;
    // this.count = this.vehicle?.Points[0]?.TotalCount;

    this.filterType = filterType;

    // this.calculateTotal();
    // this.dateValue =
    //   formatDate(formDate?.fromDate, 'yyyy-MM-dd HH:mm:ss', 'en-US') +
    //   ' to ' +
    //   formatDate(formDate?.toDate, 'yyyy-MM-dd HH:mm:ss', 'en-US');

    let reports = [
      { Distance: ['Vehicle Number', 'Date', 'Distance'] },
      {
        Stop: [
          'Vehicle Number',
          'Date',
          'Stop Time',
          'Start Time',
          'Stop Duration',
        ],
      },
      {
        Idle: ['Vehicle Number', 'Date', 'Start Time', 'End Time', 'Duration'],
      },
      {
        'Speed Report': [
          'Vehicle Number',
          'Date',
          'Start Speed',
          'End Speed',
          'Duration',
          'Distance',
        ],
      },
      { 'GeoFence Report': [] },
      {
        'Trip Report': [
          'Start Time',
          'Start Location',
          'End Time',
          'End Location',
          'Duration',
          'Distance',
        ],
      },
      {
        'Movement Summary': [
          'Duration',
          'Start Point',
          'End Point',
          'Start Address',
          'End Address',
          'Distance',
        ],
      },
      {
        'AC Report': [
          'Start Time',
          'Start Location',
          'End Time',
          'End Location',
          'Duration',
          'Distance',
        ],
      },
      {
        'temperature Report': [
          'Date Time',
          'Speed',
          'Ignition',
          'Temperature',
          'Location',
        ],
      },
    ];

    this.filteredReports = reports.filter((report) =>
      report.hasOwnProperty(this.filterType)
    );

    if (this.filterType === 'Stop' || this.filterType === 'Idle') {
      this.count = this.vehicle?.Points?.[0]?.TotalCount || this.vehicle?.TotalCount || 0;
      this.groupDataByVehicleNo();
    } else if (this.filterType === 'Trip Report') {
      this.count = this.vehicle?.Points?.[0]?.TotalCount || this.vehicle?.TotalCount || 0;
      this.groupingTrip();
    } else if (this.filterType === 'Overspeed Report') {
      this.count = this.vehicle?.Points?.[0]?.TotalCount || this.vehicle?.TotalCount || 0;
      this.groupingspeed();
    } else if (this.filterType === 'Movement Summary') {
      this.groupingMovement()
    } else if (this.filterType === 'GeoFence Report') {
      this.groupingGeofence();
    }
  }

  calculateTotal() {
    this.totalDuration = 0;
    this.totalDistance = 0;
    let totalSeconds = 0;

    if (this.vehicle && this.vehicle.Points) {
      this.vehicle?.Points?.forEach((vehicleValue: any) => {
        const [hours, minutes, seconds] =
          vehicleValue.Duration?.split(':').map(Number);
        totalSeconds += hours * 3600 + minutes * 60 + seconds;

        if (
          this.filterType === 'Trip Report' ||
          this.filterType === 'Speed Report' ||
          this.filterType === 'AC Report' ||
          this.filterType === 'Overspeed Report'
        ) {
          this.totalDuration += hours * 3600 + minutes * 60 + seconds;
          this.totalDistance += vehicleValue.Distance;
        } else if (this.filterType === 'Stop' || this.filterType === 'Idle') {
          this.totalDuration += hours * 3600 + minutes * 60 + seconds;
        }
      });
      this.totalDuration = this.formatDuration(totalSeconds);
    } else if (this.vehicle && this.vehicle) {
      this.vehicle.forEach((vehicleValue: any) => {
        vehicleValue?.Distance.forEach((val: any) => {
          if (
            this.filterType === 'Duration Report' ||
            this.filterType === 'Distance'
          ) {
            this.totalDistance += val.Distance;
          }
        });
      });
    }
  }

  // formatDuration(totalSeconds: number): string {
  //   const hours = Math.floor(totalSeconds / 3600);
  //   const minutes = Math.floor((totalSeconds % 3600) / 60);
  //   const seconds = totalSeconds % 60;
  //   return `${hours} hours ${this.padTo2Digits(minutes)} minutes ${this.padTo2Digits(seconds)} seconds`;
  // }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  selectedStartIndexes: number[] = [];
  startAddresses: string[] = [];
  selectedEndIndexes: number[] = [];
  endAddresses: string[] = [];
  loadingIndices: { [key: number]: boolean } = {};
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
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Error fetching start address:', error);
            this.startAddresses[i] = 'Failed to fetch address';
          },
          () => {}
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
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Error fetching end address:', error);
            this.endAddresses[i] = 'Failed to fetch address';
          },
          () => {

          }
        );
      }
    }
  }

  ngOnInit() {
    this.setInitialValue();
    this.displayTableSize = this.displayTableSize || this.tableSize

  }
  groupedData: any;
  groupDataByVehicleNo(): void {
    const tempGroupedData = new Map<string, VehicleData[]>();

    if (this.vehicle?.Points && Array.isArray(this.vehicle.Points) && this.vehicle.Points.length > 0) {
      this.vehicle.Points.forEach((item: VehicleData) => {
        const vehicleNo = item.VehicleNo;
        if (!tempGroupedData.has(vehicleNo)) {
          tempGroupedData.set(vehicleNo, []);
        }
        tempGroupedData.get(vehicleNo)?.push(item);
      });
    }
    
    this.groupedData = Array.from(tempGroupedData, ([vehicleNo, data]) => ({
      vehicleNo,
      data,
    }));
    
    // If no data, create an empty group to show table structure
    if (this.groupedData.length === 0 && this.filterType) {
      this.groupedData = [{
        vehicleNo: '',
        data: []
      }];
    }
  }

  groupingGeofence(): void {
    const tempGroupedData = new Map<
      string, VehicleData[]>();

    // Iterate over the vehicle array
    if (this.vehicle && Array.isArray(this.vehicle) && this.vehicle.length > 0) {
      this.vehicle.forEach((vehicleItem: any) => {
        // Ensure that Points exist before processing,
        const vehicleNo = vehicleItem.VehicleNo;
        if (vehicleItem.Points && Array.isArray(vehicleItem.Points) && vehicleItem.Points.length > 0) {
          vehicleItem.Points.forEach((item: VehicleData) => {
            if (!tempGroupedData.has(vehicleNo)) {
              tempGroupedData.set(vehicleNo, []);
            }
            tempGroupedData.get(vehicleNo)?.push(item);
          });
        }
      });
    }
    this.groupedData = Array.from(tempGroupedData, ([vehicleNo, data]) => ({
      vehicleNo,
      data,
    }));
  }
  groupingTrip() {
    const tempGroupedData = new Map<
      string,
      { data: Device[]; totalDistance: number; totalDuration: number }
    >();

    if (this.vehicle?.Points && Array.isArray(this.vehicle.Points) && this.vehicle.Points.length > 0) {
      this.vehicle.Points.forEach((item: Device) => {
        const deviceID = item.Device; // Assuming 'Device' is a string that identifies each device.
        if (!tempGroupedData.has(deviceID)) {
          tempGroupedData.set(deviceID, {
            data: [],
            totalDistance: 0,
            totalDuration: 0,
          });
        }
        const deviceData = tempGroupedData.get(deviceID);
        if (deviceData) {
          deviceData.data.push(item);
          deviceData.totalDistance += item.Distance; // Assuming 'distance' is a number representing the distance.
          deviceData.totalDuration += this.durationInSeconds(item.Duration); // Convert duration to seconds and add.
        }
      });
    }

    this.groupedData = Array.from(tempGroupedData, ([Device, details]) => ({
      Device,
      data: details.data,
      totalDistance: parseFloat(details.totalDistance.toFixed(2)), // Round to two decimal places and convert back to number.
      totalDuration: this.formatDuration(details.totalDuration), // Format total seconds into a readable string.
    }));
    
    // If no data, create an empty group to show table structure
    if (this.groupedData.length === 0 && this.filterType) {
      this.groupedData = [{
        Device: '',
        data: [],
        totalDistance: 0,
        totalDuration: '0 sec'
      }];
    }

  }
  groupingspeed() {
    const tempGroupedData = new Map<
      string,
      { data: speedData[]; totalDistance: number; totalDuration: number }
    >();

    if (this.vehicle?.Points && Array.isArray(this.vehicle.Points) && this.vehicle.Points.length > 0) {
      this.vehicle.Points.forEach((item: speedData) => {
        const deviceID = item.VehicleNo; // Assuming 'Device' is a string that identifies each device.
        if (!tempGroupedData.has(deviceID)) {
          tempGroupedData.set(deviceID, {
            data: [],
            totalDistance: 0,
            totalDuration: 0,
          });
        }
        const deviceData = tempGroupedData.get(deviceID);
        if (deviceData) {
          deviceData.data.push(item);
          deviceData.totalDistance += item.Distance; // Assuming 'distance' is a number representing the distance.
          deviceData.totalDuration += this.durationInSeconds(item.Duration); // Convert duration to seconds and add.
        }
      });
    }

    this.groupedData = Array.from(tempGroupedData, ([Device, details]) => ({
      Device,
      data: details.data,
      totalDistance: parseFloat(details.totalDistance.toFixed(2)), // Round to two decimal places and convert back to number.
      totalDuration: this.formatDuration(details.totalDuration), // Format total seconds into a readable string.
    }));
    
    // If no data, create an empty group to show table structure
    if (this.groupedData.length === 0 && this.filterType) {
      this.groupedData = [{
        Device: '',
        data: [],
        totalDistance: 0,
        totalDuration: '0 sec'
      }];
    }

  }

  groupingMovement() {
    const tempGroupedData = new Map<
      string,
      { data: Device[]; totalDistance: number; totalDuration: number }
    >();

    if (this.vehicle?.Result && Array.isArray(this.vehicle.Result) && this.vehicle.Result.length > 0) {
      this.vehicle.Result.forEach((item: any) => {

        const deviceID = this.vehicle.Vehicle?.VehicleNo || '';
        // Assuming 'Device' is a string that identifies each device.
        if (!tempGroupedData.has(deviceID)) {
          tempGroupedData.set(deviceID, {
            data: [],
            totalDistance: 0,
            totalDuration: 0,
          });
        }
        const deviceData = tempGroupedData.get(deviceID);
        if (deviceData) {
          deviceData.data.push(item);
          deviceData.totalDistance += item.Distance; // Assuming 'distance' is a number representing the distance.
          // deviceData.totalDuration += this.durationInSeconds(item.Duration); // Convert duration to seconds and add.
        }
      });
    }

    this.groupedData = Array.from(tempGroupedData, ([Device, details]) => ({
      Device,
      data: details.data,
      totalDistance: parseFloat(details.totalDistance.toFixed(2)), 
      totalDuration: this.formatDuration(details.totalDuration), 
    }));
    
    // If no data, create an empty group to show table structure
    if (this.groupedData.length === 0 && this.filterType) {
      this.groupedData = [{
        Device: '',
        data: [],
        totalDistance: 0,
        totalDuration: '0 sec'
      }];
    }

  }


  groupingOverspeed() {
    const tempGroupedData = new Map<
      string,
      { data: speedData[]; totalDistance: number; totalDuration: number }
    >();

    this.vehicle.Points.forEach((item: speedData) => {
      const deviceID = item.VehicleNo;
      if (!tempGroupedData.has(deviceID)) {
        tempGroupedData.set(deviceID, {
          data: [],
          totalDistance: 0,
          totalDuration: 0,
        });
      }
      const deviceData = tempGroupedData.get(deviceID);
      if (deviceData) {
        deviceData.data.push(item);
      }
    });

    this.groupedData = Array.from(tempGroupedData, ([Device, details]) => ({
      Device,
      data: details.data,
      totalDistance: parseFloat(details.totalDistance.toFixed(2)), // Round to two decimal places and convert back to number.
      totalDuration: this.formatDuration(details.totalDuration), // Format total seconds into a readable string.
    }));

  }
  // Helper to convert hh:mm:ss into total seconds.
  durationInSeconds(duration: string): number {
    const [hours, minutes, seconds] = duration?.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Helper to format the duration from total seconds into hours, minutes, and seconds.
  formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if (hours > 0) parts.push(`${hours} hr`);
    if (minutes > 0) parts.push(`${minutes} min`);
    if (seconds > 0) parts.push(`${seconds} sec`);
    return parts.join(' ');
  }

  // Helper to pad numbers to two digits with leading zeros.
  padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  setInitialValue() {
    this.tableData = [
      { key: 'keyValue', val: 'Vehicle No' },
      { key: 'keyValue', val: 'Event IN' },
      { key: 'keyValue', val: 'Event OUT' },
      { key: 'keyValue', val: 'Geofance Name' },
    ];
    this.tableData1 = [
      { key: 'keyValue', val: 'Vehicle No' },
      { key: 'keyValue', val: 'Date' },
      { key: 'keyValue', val: 'Total' },
    ];

    this.tableData2 = [
      { key: 'keyValue', val: 'Vehicle No' },
      { key: 'keyValue', val: 'Alert Type Name' },
      { key: 'keyValue', val: 'Alert Time' },
      { key: 'keyValue', val: 'Creation Time' },
      { key: 'keyValue', val: 'Status' },
    ];
  }
  @ViewChild('TABLE', { static: false }) table: ElementRef | any;
  exportToExcels(): void {
    if (!this.filterType) {
      this.notificationService.showError('Please select a report type first');
      return;
    }

    if (this.filterType === 'Stop' || this.filterType == 'Idle') {
      if (!this.groupedData || this.groupedData.length === 0) {
        this.notificationService.showError('No data available to export');
        return;
      }
      this.stopToExcel(this.groupedData);
    }
    if (this.filterType === 'Distance') {
      if (!this.vehicle || this.vehicle.length === 0) {
        this.notificationService.showError('No data available to export');
        return;
      }
      this.distanceToExcel();
    }
    if (this.filterType === 'Trip Report') {
      if (!this.groupedData || this.groupedData.length === 0) {
        this.notificationService.showError('No data available to export');
        return;
      }
      this.Tripreport(this.groupedData)
    }
    if (this.filterType === 'Overspeed Report') {
      if (!this.groupedData || this.groupedData.length === 0) {
        this.notificationService.showError('No data available to export');
        return;
      }
      this.SpeedReport(this.groupedData)
    }
    if (this.filterType === 'GeoFence Report') {
      if (!this.vehicle || this.vehicle.length === 0) {
        this.notificationService.showError('No data available to export');
        return;
      }
      this.geofenceReport()
    }
    if (this.filterType === 'Duration Report') {
      if (!this.vehicle || this.vehicle.length === 0) {
        this.notificationService.showError('No data available to export');
        return;
      }
      this.durationReport()
    }
    if (this.filterType === 'Movement Summary') {
      if (!this.groupedData || this.groupedData.length === 0) {
        this.notificationService.showError('No data available to export');
        return;
      }
      this.movmentSummary(this.groupedData)
    }
  }

  async movmentSummary(groupedData: any[]) {
    const formattedData = await Promise.all(
      groupedData.map(async (group) => {
        const dataWithAddresses = await Promise.all(
          group.data.map(async (item: any, i: any) => {
            const startLocation = await this.viewAddressExcel('start', item.StartPoint, i);
            const endLocation = await this.viewAddressExcel('end', item.EndPoint, i);

            return {
              VehicleNo: this.vehicle.Vehicle.VehicleNo,
              StartTime: moment.default(item.StartPoint).format('MMM D, YYYY, h:mm:ss A'),
              StartLocation: this.isLocation == 2 ? startLocation : item.StartPoint?.Lat + ',' + item.StartPoint?.Lng,
              EndTime: moment.default(item.EndPoint).format('MMM D, YYYY, h:mm:ss A'),
              EndLocation: this.isLocation == 2 ? endLocation : item.EndPoint?.Lat + ',' + item.EndPoint?.Lng,
              Duration: moment.default(item.StartTime).format('h:mm:ss A') + " " + 'to' + " " + moment.default(item.EndTime).format('h:mm:ss A'),
              Distance: item.Distance.toFixed(2) + ' Km',
            };
          })
        );

        // // Calculate total duration and total distance for the current vehicle
        // const totalDuration = dataWithAddresses.reduce(
        //   (acc, row) => acc + this.parseDuration(row.Duration),
        //   0
        // );
        const totalDistance = dataWithAddresses.reduce(
          (acc, row) => acc + parseFloat(row.Distance),
          0
        );

        // Add a total row for the current vehicle
        dataWithAddresses.push({
          VehicleNo: 'Total',
          StartTime: '',
          StartLocation: '',
          EndTime: '',
          EndLocation: '',
          // Duration: this.formatDuration(totalDuration), // Format total duration as needed
          Distance: totalDistance.toFixed(2) + ' Km',
        });

        return dataWithAddresses;
      })
    );

    const flatFormattedData = formattedData.flat();

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flatFormattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trip Data');

    // Adjust column widths based on content length
    const maxColumnWidths = Object.keys(flatFormattedData[0]).map((key) => {
      // Find the max length of the content in each column
      const maxLength = Math.max(
        key.length, // Header length
        ...flatFormattedData.map((row) => (row[key] ? row[key].toString().length : 0))
      );
      // Set a minimum width and add some padding
      return { width: Math.max(10, maxLength + 2) };
    });

    worksheet['!cols'] = maxColumnWidths; // Apply column widths to the worksheet

    const fileName = `${this.filterType}-Report.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  durationReport() {
    if (!this.vehicle || this.vehicle.length === 0) {
      this.notificationService.showError('No data available to export');
      return;
    }

    let grandTotalDistance = 0; // To accumulate the total distance for all vehicles

    // Flatten and format the data for each vehicle, including individual totals
    const formattedData = this.vehicle.flatMap((vehicleItem: { Device: { VehicleNo: string; }; Distance: any[]; }) => {
      // Calculate total distance for the current vehicle group
      const totalDistance = vehicleItem.Distance.reduce((acc: number, entry: { Distance: string; }) => acc + parseFloat(entry.Distance), 0);
      grandTotalDistance += totalDistance; // Add to grand total

      // Format the data for each entry and add the "Total" row for the group
      const dataWithTotal = [
        ...vehicleItem.Distance.map((entry: any) => ({
          VehicleNo: vehicleItem.Device.VehicleNo,
          Date: entry.Date ? new Date(entry.Date).toLocaleString() : '',
          ToDate: entry.ToDate ? new Date(entry.ToDate).toLocaleString() : '',
          Distance: `${entry.Distance} KM`,
        })),
        {
          VehicleNo: 'Total',
          Date: '',
          ToDate: '',
          Distance: `${totalDistance.toFixed(2)} KM`, // Format total distance as needed
        },
      ];

      return dataWithTotal;
    });

    // Add a final "Grand Total" row for all vehicles combined
    formattedData.push({
      VehicleNo: 'Grand Total',
      Date: '',
      ToDate: '',
      Distance: `${grandTotalDistance.toFixed(2)} KM`, // Grand total distance
    });

    // Convert the formatted data to an Excel worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Duration Report');

    // Adjust column widths based on content length with added spacing
    const columnWidths: Record<string, number> = Object.keys(ws).reduce((acc, key) => {
      if (key[0] === '!') return acc; // Skip meta properties
      const col = key.replace(/[0-9]/g, ''); // Extract column letter(s)
      const content = ws[key]?.v?.toString() || ''; // Cell content as string
      acc[col] = Math.max(acc[col] || 10, content.length + 5); // Add padding of 5 to each cell content length
      return acc;
    }, {} as Record<string, number>);

    // Apply column widths to the worksheet
    ws['!cols'] = Object.entries(columnWidths).map(([_, width]) => ({ width: width as number }));

    // Save the Excel file
    XLSX.writeFile(wb, 'durationReport.xlsx');
  }

  geofenceReport() {
    if (!this.vehicle || this.vehicle.length === 0) {
      this.notificationService.showError('No data available to export');
      return;
    }

    const formattedData = this.vehicle.flatMap((group: any) => {
      // Calculate total duration for the current vehicle group
      const totalDuration = group.Points.reduce((acc: number, entry: { Duration: string; }) => acc + this.parseDuration(entry.Duration), 0);

      // Format the data for each entry and add the "Total" row for the group
      const dataWithTotal = [
        ...group.Points.map((entry: any) => ({
          VehicleNo: entry.VehicleNo,
          GeoFenceName: entry.GeofenceName,
          In: new Date(entry.StartTime).toLocaleString(),
          Out: new Date(entry.EndTime).toLocaleString(),
          Duration: entry.Duration,
        })),
        {
          VehicleNo: 'Total',
          GeoFenceName: '',
          In: '',
          Out: '',
          Duration: this.formatDuration(totalDuration), // Format total duration as needed
        },
      ];

      return dataWithTotal;
    });

    // Convert the formatted data to an Excel worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'GeoFence Report');

    // Adjust column widths based on content length with added spacing
    const columnWidths: Record<string, number> = Object.keys(ws).reduce((acc, key) => {
      if (key[0] === '!') return acc; // Skip meta properties
      const col = key.replace(/[0-9]/g, ''); // Extract column letter(s)
      const content = ws[key]?.v?.toString() || ''; // Cell content as string
      acc[col] = Math.max(acc[col] || 10, content.length + 5); // Add padding of 5 to each cell content length
      return acc;
    }, {} as Record<string, number>);

    // Convert to array of widths for worksheet settings
    ws['!cols'] = Object.entries(columnWidths).map(([_, width]) => ({ width: width as number })); // Explicitly cast width to number

    // Save the Excel file
    XLSX.writeFile(wb, 'geofenceReport.xlsx');
  }

  distanceToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Adjust column widths based on content length with added spacing
    const columnWidths: Record<string, number> = Object.keys(ws).reduce((acc, key) => {
      if (key[0] === '!') return acc; // Skip meta properties
      const col = key.replace(/[0-9]/g, ''); // Extract column letter(s)
      const content = ws[key]?.v?.toString() || ''; // Cell content as string
      acc[col] = Math.max(acc[col] || 10, content.length + 5); // Add padding of 5 to each cell content length
      return acc;
    }, {} as Record<string, number>);

    // Convert to array of widths for worksheet settings
    ws['!cols'] = Object.entries(columnWidths).map(([_, width]) => ({ width: width as number })); // Explicitly cast width to number

    /* save to file */
    XLSX.writeFile(wb, 'distanceReport.xlsx');
  }

  async stopToExcel(groupedData: any[]): Promise<void> {
    if (!groupedData || groupedData.length === 0) {
      this.notificationService.showError('No data available to export');
      return;
    }

    const formattedData = await Promise.all(
      groupedData.map(async (group) => {
        if (!group.data || group.data.length === 0) return [];
        return await Promise.all(
          group.data.map(async (item: any, i: any) => {

            const locationAddress = await this.viewAddressExcel('start', item.Loc, i); // Assuming this function retrieves the address

            return {
              VehicleNo: group.vehicleNo,
              StartTime: moment
                .default(item.StartTime)
                .format('MMM D, YYYY, h:mm:ss A'),
              EndTime: moment
                .default(item.EndTime)
                .format('MMM D, YYYY, h:mm:ss A'),
              Duration: item.Duration,
              Address: this.isLocation == 2 ? locationAddress : item.Loc?.Lat + ',' + item.Loc?.Lng// Add the address here
            };
          })
        );
      })
    );

    const flatFormattedData = formattedData.flat().filter(item => item !== undefined && item !== null);

    if (flatFormattedData.length === 0) {
      this.notificationService.showError('No data available to export');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flatFormattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Adjust column widths based on content length
    const maxColumnWidths = Object.keys(flatFormattedData[0]).map((key) => {
      // Find the max length of the content in each column
      const maxLength = Math.max(
        key.length, // Header length
        ...flatFormattedData.map((row) => (row[key] ? row[key].toString().length : 0))
      );
      // Set a minimum width and add some padding
      return { width: Math.max(10, maxLength + 2) };
    });

    worksheet['!cols'] = maxColumnWidths; // Apply column widths to the worksheet

    const fileName = `${this.filterType}-Report.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  async Tripreport(groupedData: any[]) {
    const formattedData = await Promise.all(
      groupedData.map(async (group) => {
        const dataWithAddresses = await Promise.all(
          group.data.map(async (item: any, i: any) => {
            const startLocation = await this.viewAddressExcel('start', item.Start, i);
            const endLocation = await this.viewAddressExcel('end', item.End, i);

            return {
              VehicleNo: group.Device,
              StartTime: moment.default(item.StartTime).format('MMM D, YYYY, h:mm:ss A'),
              StartLocation: this.isLocation == 2 ? startLocation : item.Start?.Lat + ',' + item.Start?.Lng,
              EndTime: moment.default(item.EndTime).format('MMM D, YYYY, h:mm:ss A'),
              EndLocation: this.isLocation == 2 ? endLocation : item.End?.Lat + ',' + item.End?.Lng,
              Duration: item.Duration,
              Distance: item.Distance.toFixed(2) + ' Km',
            };
          })
        );

        // Calculate total duration and total distance for the current vehicle
        const totalDuration = dataWithAddresses.reduce(
          (acc, row) => acc + this.parseDuration(row.Duration),
          0
        );
        const totalDistance = dataWithAddresses.reduce(
          (acc, row) => acc + parseFloat(row.Distance),
          0
        );

        // Add a total row for the current vehicle
        dataWithAddresses.push({
          VehicleNo: 'Total',
          StartTime: '',
          StartLocation: '',
          EndTime: '',
          EndLocation: '',
          Duration: this.formatDuration(totalDuration), // Format total duration as needed
          Distance: totalDistance.toFixed(2) + ' Km',
        });

        return dataWithAddresses;
      })
    );

    const flatFormattedData = formattedData.flat();

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flatFormattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trip Data');

    // Adjust column widths based on content length
    const maxColumnWidths = Object.keys(flatFormattedData[0]).map((key) => {
      // Find the max length of the content in each column
      const maxLength = Math.max(
        key.length, // Header length
        ...flatFormattedData.map((row) => (row[key] ? row[key].toString().length : 0))
      );
      // Set a minimum width and add some padding
      return { width: Math.max(10, maxLength + 2) };
    });

    worksheet['!cols'] = maxColumnWidths; // Apply column widths to the worksheet

    const fileName = `${this.filterType}-Report.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  async SpeedReport(groupedData: any[]) {
    // Format the data with addresses for the speed report
    const formattedData = await Promise.all(
      groupedData.map(async (group) => {
        const dataWithAddresses = await Promise.all(
          group.data.map(async (item: any, i: any) => {
            // Fetch addresses for start and end locations
            const startLocation = await this.viewAddressExcel('start', item.StartLoc, i);
            const endLocation = await this.viewAddressExcel('end', item.EndLoc, i);

            return {
              VehicleNo: group.Device,
              StartTime: moment.default(item.StartTime).format('MMM D, YYYY, h:mm:ss A'),
              StartLocation: this.isLocation == 2 ? startLocation : item.StartLoc?.Lat + ',' + item.StartLoc?.Lng,
              EndTime: moment.default(item.EndTime).format('MMM D, YYYY, h:mm:ss A'),
              EndLocation: this.isLocation == 2 ? endLocation : item.EndLoc?.Lat + ',' + item.EndLoc?.Lng,
              Duration: item.Duration,
              Distance: item.Distance.toFixed(2) + ' Km',
              Speed: item.StartSpeed + ' km/h', // Include start speed
            };
          })
        );

        // Calculate total duration and total distance for the current vehicle
        const totalDuration = dataWithAddresses.reduce(
          (acc, row) => acc + this.parseDuration(row.Duration),
          0
        );
        const totalDistance = dataWithAddresses.reduce(
          (acc, row) => acc + parseFloat(row.Distance),
          0
        );

        // Add a total row for the current vehicle with "Total" as VehicleNo
        dataWithAddresses.push({
          VehicleNo: 'Total', // Set to "Total" instead of the device number
          StartTime: '',
          StartLocation: '',
          EndTime: '',
          EndLocation: '',
          Duration: this.formatDuration(totalDuration), // Format total duration as needed
          Distance: totalDistance.toFixed(2) + ' Km',
          Speed: '', // Empty since it's not relevant for totals
        });

        return dataWithAddresses;
      })
    );

    const flatFormattedData = formattedData.flat();

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flatFormattedData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Speed Trip Data');

    // Adjust column widths based on content length
    const maxColumnWidths = Object.keys(flatFormattedData[0]).map((key) => {
      // Find the max length of the content in each column
      const maxLength = Math.max(
        key.length, // Header length
        ...flatFormattedData.map((row) => (row[key] ? row[key].toString().length : 0))
      );
      // Set a minimum width and add some padding
      return { width: Math.max(10, maxLength + 2) };
    });

    worksheet['!cols'] = maxColumnWidths; // Apply column widths to the worksheet

    const fileName = `${this.filterType}-SpeedReport.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  // Helper function to parse duration string into seconds
  parseDuration(duration: string): number {
    const parts = duration.split(':').map(Number); // Assuming duration is in HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // Convert to seconds
  }

  viewAddressExcel(type: 'start' | 'end', address: any, i: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingIndices[i] = true;

      const fetchAddress = () => {
        this.commonService.getAddressValue(address).subscribe(
          (data: any) => {
            if (type === 'start') {
              this.startAddresses[i] = data;
            } else {
              this.endAddresses[i] = data;
            }
            this.loadingIndices[i] = false;
            this.cdr.detectChanges();
            resolve(data); // Resolve the Promise with the fetched address
          },
          (error) => {
            console.error(`Error fetching ${type} address:`, error);
            if (type === 'start') {
              this.startAddresses[i] = 'Failed to fetch address';
            } else {
              this.endAddresses[i] = 'Failed to fetch address';
            }
            this.loadingIndices[i] = false;
            this.cdr.detectChanges();
            reject('Failed to fetch address'); // Reject the Promise with an error message
          }
        );
      };

      // Check whether the address is already selected and being processed
      if (type === 'start' && !this.selectedStartIndexes.includes(i)) {
        this.selectedStartIndexes.push(i);
        this.startAddresses[i] = '';
        fetchAddress();
      } else if (type === 'end' && !this.selectedEndIndexes.includes(i)) {
        this.selectedEndIndexes.push(i);
        this.endAddresses[i] = '';
        fetchAddress();
      } else {
        // If already selected, resolve immediately with the existing address
        if (type === 'start') {
          resolve(this.startAddresses[i]);
        } else {
          resolve(this.endAddresses[i]);
        }
      }
    });
  }


  onTableDataChange(event: any) {
    this.page = event;
    this.filterPagination.emit({
      pageNumber: this.page,
      pageSize: this.tableSize
    })
  };

  onTableSizeChange(event: any): void {
    const selectedValue = event.target.value;

    if (selectedValue === 'All') {
      this.displayTableSize = 'All';
      this.tableSize = 5000; // Set to 5000 or whatever large number represents "All"
    } else {
      this.displayTableSize = parseInt(selectedValue, 10);
      this.tableSize = this.displayTableSize;
    }

    this.page = 1;
    this.filterPagination.emit({
      pageNumber: this.page,
      pageSize: this.tableSize
    })
  }

  bsModalRef!: BsModalRef

  // openMap(data:any) {

  //   const initialState: ModalOptions = {
  //     initialState: {
  //       data: data,
  //     },
  //   };

  //   this.bsModalRef = this.modalService.show(
  //     LocationInMapComponent,
  //     Object.assign(initialState, { class: 'modal-xl modal-dialog-centered' })
  //   );
  // }


  exportToPDF() {
    if (this.filterType === 'Stop' || this.filterType == 'Idle') {
      this.stopToPdf(this.groupedData);
    }
    if (this.filterType === 'Distance' && this.daysDifference > 31) {
      this.notificationService.showWarning('Please select less then or equal to 31 days')
    } else if (this.filterType === 'Distance') {
      this.distanceToPdf();
    }
    if (this.filterType === 'Trip Report') {
      this.Trippdf(this.groupedData)

    }
    if (this.filterType === 'Overspeed Report') {
      this.Speedpdf(this.groupedData)
    }
    if (this.filterType === 'GeoFence Report') {
      this.geofencepdf()
    }
    if (this.filterType === 'Duration Report') {
      this.durationpdf()
    }
    if (this.filterType === 'Movement Summary') {
      this.movmentSummarypdf(this.groupedData)

    }
  }

  async movmentSummarypdf(groupedData: any[]) {
    // Create a new jsPDF instance
    const doc: any = new jsPDF();

    // Add the main title at the top of the document
    doc.setFontSize(18);
    doc.text(`${this.filterType} Report`, 14, 10);

    let currentY = 30; // Starting Y position for the first table

    // Loop through each vehicle group
    for (const group of groupedData) {
      // Prepare the data for each vehicle group
      const dataWithAddresses = await Promise.all(
        group.data.map(async (item: any, i: any) => {
          const startLocation = await this.viewAddressExcel('start', item.StartPoint, i);
          const endLocation = await this.viewAddressExcel('end', item.EndPoint, i);

          return {
            VehicleNo: this.vehicle.Vehicle.VehicleNo,
            StartTime: moment.default(item.StartTime).format('MMM D, YYYY, h:mm:ss A'),
            StartLocation: this.isLocation == 2 ? startLocation : item.StartPoint?.Lat + ',' + item.StartPoint?.Lng,
            EndTime: moment.default(item.EndTime).format('MMM D, YYYY, h:mm:ss A'),
            EndLocation: this.isLocation == 2 ? endLocation : item.EndPoint?.Lat + ',' + item.EndPoint?.Lng,
            Duration: moment.default(item.StartTime).format('h:mm:ss A') + " " + 'to' + " " + moment.default(item.EndTime).format('h:mm:ss A'),
            Distance: item.Distance.toFixed(2) + ' Km',
          };
        })
      );

      // // Calculate total duration and total distance for the current vehicle
      // const totalDuration = dataWithAddresses.reduce(
      //   (acc, row) => acc + this.parseDuration(row.Duration),
      //   0
      // );
      const totalDistance = dataWithAddresses.reduce(
        (acc, row) => acc + parseFloat(row.Distance),
        0
      );

      // Add a total row for the current vehicle
      dataWithAddresses.push({
        VehicleNo: 'Total',
        StartTime: '',
        StartLocation: '',
        EndTime: '',
        EndLocation: '',
        // Duration: this.formatDuration(totalDuration), // Format total duration as needed
        Distance: totalDistance.toFixed(2) + ' Km',
      });

      // Define the columns and rows for the PDF table
      const columns = ['Vehicle No', 'Start Time', 'Start Location', 'End Time', 'End Location', 'Duration', 'Distance'];
      const rows = dataWithAddresses.map(item => [
        item.VehicleNo,
        item.StartTime,
        item.StartLocation,
        item.EndTime,
        item.EndLocation,
        item.Duration,
        item.Distance,
      ]);

      // Add the subtitle for each vehicle
      doc.setFontSize(14);
      doc.text(`Vehicle No: ${this.vehicle.Vehicle.VehicleNo}`, 14, currentY);
      currentY += 10; // Move down for the table

      // Add the table for each vehicle using autoTable with adjusted width and margins
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: currentY,
        tableWidth: 'auto', // Adjusts table width to fit the content
        margin: { top: 20, right: 5, bottom: 20, left: 5 }, // Adjust margins to reduce space on the left and right
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [22, 160, 133], // Custom header color
          textColor: [255, 255, 255], // White text
          fontStyle: 'bold',
        },
        theme: 'striped', // Use striped theme
      });

      // Update currentY to the next available position after the table
      currentY = doc.autoTable.previous.finalY + 15;

      // Check if a new page is needed
      if (currentY > doc.internal.pageSize.height - 30) {
        doc.addPage();
        currentY = 30; // Reset Y position for the new page
      }
    }

    // Save the PDF
    doc.save(`${this.filterType}-Report.pdf`);
  }

  //pdf download
  async stopToPdf(groupedData: any[]): Promise<void> {
    // Create a new jsPDF instance
    const doc: any = new jsPDF();

    // Add the main title at the top of the document
    doc.setFontSize(18);
    doc.text(`${this.filterType} Report`, 14, 10);

    let currentY = 30; // Starting Y position for the first table

    // Loop through each vehicle group
    for (const group of groupedData) {
      // Prepare the data for each vehicle group
      const formattedData = await Promise.all(
        group.data.map(async (item: any, i: any) => {
          const locationAddress = await this.viewAddressExcel('start', item.Loc, i); // Retrieve address

          return {
            VehicleNo: group.vehicleNo,
            StartTime: moment.default(item.StartTime).format('MMM D, YYYY, h:mm:ss A'),
            EndTime: moment.default(item.EndTime).format('MMM D, YYYY, h:mm:ss A'),
            Duration: item.Duration,
            Address: this.isLocation == 2 ? locationAddress : item.Loc?.Lat + ',' + item.Loc?.Lng, // Include address
          };
        })
      );

      // Define the columns and rows for the PDF table
      const columns = ['Vehicle No', 'Start Time', 'End Time', 'Duration', 'Address'];
      const rows = formattedData.map(item => [
        item.VehicleNo,
        item.StartTime,
        item.EndTime,
        item.Duration,
        item.Address,
      ]);

      // Add the subtitle for each vehicle
      doc.setFontSize(14);
      doc.text(`Vehicle No: ${group.vehicleNo}`, 14, currentY);
      currentY += 10; // Move down for the table

      // Add the table for each vehicle using autoTable with adjusted width and margins
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: currentY,
        tableWidth: 'auto', // Adjusts table width to fit the content
        margin: { top: 20, right: 5, bottom: 20, left: 5 }, // Adjust margins to reduce space on the left and right
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [22, 160, 133], // Custom header color
          textColor: [255, 255, 255], // White text
          fontStyle: 'bold',
        },
        theme: 'striped', // Use striped theme
      });

      // Update currentY to the next available position after the table
      currentY = doc.autoTable.previous.finalY + 15;

      // Check if a new page is needed
      if (currentY > doc.internal.pageSize.height - 30) {
        doc.addPage();
        currentY = 30; // Reset Y position for the new page
      }
    }

    // Save the PDF
    doc.save(`${this.filterType}-Report.pdf`);
  }

  async Trippdf(groupedData: any[]) {
    // Create a new jsPDF instance
    const doc: any = new jsPDF();

    // Add the main title at the top of the document
    doc.setFontSize(18);
    doc.text(`${this.filterType} Report`, 14, 10);

    let currentY = 30; // Starting Y position for the first table

    // Loop through each vehicle group
    for (const group of groupedData) {
      // Prepare the data for each vehicle group
      const dataWithAddresses = await Promise.all(
        group.data.map(async (item: any, i: any) => {
          const startLocation = await this.viewAddressExcel('start', item.Start, i);
          const endLocation = await this.viewAddressExcel('end', item.End, i);

          return {
            VehicleNo: group.Device,
            StartTime: moment.default(item.StartTime).format('MMM D, YYYY, h:mm:ss A'),
            StartLocation: this.isLocation == 2 ? startLocation : item.Start?.Lat + ',' + item.Start?.Lng,
            EndTime: moment.default(item.EndTime).format('MMM D, YYYY, h:mm:ss A'),
            EndLocation: this.isLocation == 2 ? endLocation : item.End?.Lat + ',' + item.End?.Lng,
            Duration: item.Duration,
            Distance: item.Distance.toFixed(2) + ' Km',
          };
        })
      );

      // Calculate total duration and total distance for the current vehicle
      const totalDuration = dataWithAddresses.reduce(
        (acc, row) => acc + this.parseDuration(row.Duration),
        0
      );
      const totalDistance = dataWithAddresses.reduce(
        (acc, row) => acc + parseFloat(row.Distance),
        0
      );

      // Add a total row for the current vehicle
      dataWithAddresses.push({
        VehicleNo: 'Total',
        StartTime: '',
        StartLocation: '',
        EndTime: '',
        EndLocation: '',
        Duration: this.formatDuration(totalDuration), // Format total duration as needed
        Distance: totalDistance.toFixed(2) + ' Km',
      });

      // Define the columns and rows for the PDF table
      const columns = ['Vehicle No', 'Start Time', 'Start Location', 'End Time', 'End Location', 'Duration', 'Distance'];
      const rows = dataWithAddresses.map(item => [
        item.VehicleNo,
        item.StartTime,
        item.StartLocation,
        item.EndTime,
        item.EndLocation,
        item.Duration,
        item.Distance,
      ]);

      // Add the subtitle for each vehicle
      doc.setFontSize(14);
      doc.text(`Vehicle No: ${group.Device}`, 14, currentY);
      currentY += 10; // Move down for the table

      // Add the table for each vehicle using autoTable with adjusted width and margins
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: currentY,
        tableWidth: 'auto', // Adjusts table width to fit the content
        margin: { top: 20, right: 5, bottom: 20, left: 5 }, // Adjust margins to reduce space on the left and right
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [22, 160, 133], // Custom header color
          textColor: [255, 255, 255], // White text
          fontStyle: 'bold',
        },
        theme: 'striped', // Use striped theme
      });

      // Update currentY to the next available position after the table
      currentY = doc.autoTable.previous.finalY + 15;

      // Check if a new page is needed
      if (currentY > doc.internal.pageSize.height - 30) {
        doc.addPage();
        currentY = 30; // Reset Y position for the new page
      }
    }

    // Save the PDF
    doc.save(`${this.filterType}-Report.pdf`);
  }

  async Speedpdf(groupedData: any[]) {
    // Create a new jsPDF instance
    const doc: any = new jsPDF();

    // Add the main title at the top of the document
    doc.setFontSize(18);
    doc.text(`${this.filterType} Speed Report`, 14, 10);

    let currentY = 30; // Starting Y position for the first table

    // Loop through each vehicle group
    for (const group of groupedData) {
      // Prepare the data for each vehicle group
      const dataWithAddresses = await Promise.all(
        group.data.map(async (item: any, i: any) => {
          // Fetch addresses for start and end locations
          const startLocation = await this.viewAddressExcel('start', item.StartLoc, i);
          const endLocation = await this.viewAddressExcel('end', item.EndLoc, i);

          return {
            VehicleNo: group.Device,
            StartTime: moment.default(item.StartTime).format('MMM D, YYYY, h:mm:ss A'),
            StartLocation: this.isLocation == 2 ? startLocation : item.StartLoc?.Lat + ',' + item.StartLoc?.Lng,
            EndTime: moment.default(item.EndTime).format('MMM D, YYYY, h:mm:ss A'),
            EndLocation: this.isLocation == 2 ? endLocation : item.EndLoc?.Lat + ',' + item.EndLoc?.Lng,
            Duration: item.Duration,
            Distance: item.Distance.toFixed(2) + ' Km',
            Speed: item.StartSpeed + ' km/h', // Include start speed
          };
        })
      );

      // Calculate total duration and total distance for the current vehicle
      const totalDuration = dataWithAddresses.reduce(
        (acc, row) => acc + this.parseDuration(row.Duration),
        0
      );
      const totalDistance = dataWithAddresses.reduce(
        (acc, row) => acc + parseFloat(row.Distance),
        0
      );

      // Add a total row for the current vehicle
      dataWithAddresses.push({
        VehicleNo: 'Total', // Set to "Total" instead of the device number
        StartTime: '',
        StartLocation: '',
        EndTime: '',
        EndLocation: '',
        Duration: this.formatDuration(totalDuration), // Format total duration as needed
        Distance: totalDistance.toFixed(2) + ' Km',
        Speed: '', // Empty since it's not relevant for totals
      });

      // Define the columns and rows for the PDF table
      const columns = ['Vehicle No', 'Start Time', 'Start Location', 'End Time', 'End Location', 'Duration', 'Distance', 'Speed'];
      const rows = dataWithAddresses.map(item => [
        item.VehicleNo,
        item.StartTime,
        item.StartLocation,
        item.EndTime,
        item.EndLocation,
        item.Duration,
        item.Distance,
        item.Speed,
      ]);

      // Add the subtitle for each vehicle
      doc.setFontSize(14);
      doc.text(`Vehicle No: ${group.Device}`, 14, currentY);
      currentY += 10; // Move down for the table

      // Add the table for each vehicle using autoTable with adjusted width and margins
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: currentY,
        tableWidth: 'auto', // Adjusts table width to fit the content
        margin: { top: 20, right: 5, bottom: 20, left: 5 }, // Adjust margins to reduce space on the left and right
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [22, 160, 133], // Custom header color
          textColor: [255, 255, 255], // White text
          fontStyle: 'bold',
        },
        theme: 'striped', // Use striped theme
      });

      // Update currentY to the next available position after the table
      currentY = doc.autoTable.previous.finalY + 15;

      // Check if a new page is needed
      if (currentY > doc.internal.pageSize.height - 30) {
        doc.addPage();
        currentY = 30; // Reset Y position for the new page
      }
    }

    // Save the PDF
    doc.save(`${this.filterType}-SpeedReport.pdf`);
  }

  geofencepdf() {
    const formattedData = this.vehicle.flatMap((group: any) => {
      // Calculate total duration for the current vehicle group
      const totalDuration = group.Points.reduce((acc: number, entry: { Duration: string; }) => acc + this.parseDuration(entry.Duration), 0);

      // Format the data for each entry and add the "Total" row for the group
      const dataWithTotal = [
        ...group.Points.map((entry: any) => ({
          VehicleNo: entry.VehicleNo,
          GeoFenceName: entry.GeofenceName,
          In: new Date(entry.StartTime).toLocaleString(),
          Out: new Date(entry.EndTime).toLocaleString(),
          Duration: entry.Duration,
        })),
        {
          VehicleNo: 'Total',
          GeoFenceName: '',
          In: '',
          Out: '',
          Duration: this.formatDuration(totalDuration), // Format total duration as needed
        },
      ];

      return dataWithTotal;
    });

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Define the columns and rows for the PDF table
    const columns = ['Vehicle No', 'GeoFence Name', 'In', 'Out', 'Duration'];
    const rows = formattedData.map((entry: any) => [
      entry.VehicleNo,
      entry.GeoFenceName,
      entry.In,
      entry.Out,
      entry.Duration,
    ]);

    // Add the title
    doc.setFontSize(18);
    doc.text('GeoFence Report', 14, 22);

    // Add the table using autoTable with adjusted width and margins
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      tableWidth: 'auto', // Adjusts table width to fit the content
      margin: { top: 20, right: 5, bottom: 20, left: 5 }, // Adjust margins to reduce space on the left and right
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Custom header color
        textColor: [255, 255, 255], // White text
        fontStyle: 'bold',
      },
      theme: 'striped', // Use striped theme
    });

    // Save the PDF
    doc.save('geofenceReport.pdf');
  }
  durationpdf() {
    let grandTotalDistance = 0; // To accumulate the total distance for all vehicles

    // Flatten and format the data for each vehicle, including individual totals
    const formattedData = this.vehicle.flatMap((vehicleItem: { Device: { VehicleNo: string; }; Distance: any[]; }) => {
      // Calculate total distance for the current vehicle group
      const totalDistance = vehicleItem.Distance.reduce((acc: number, entry: { Distance: string; }) => acc + parseFloat(entry.Distance), 0);
      grandTotalDistance += totalDistance; // Add to grand total

      // Format the data for each entry and add the "Total" row for the group
      const dataWithTotal = [
        ...vehicleItem.Distance.map((entry: any) => ({
          VehicleNo: vehicleItem.Device.VehicleNo,
          Date: entry.Date ? new Date(entry.Date).toLocaleString() : '',
          ToDate: entry.ToDate ? new Date(entry.ToDate).toLocaleString() : '',
          Distance: `${entry.Distance} KM`,
        })),
        {
          VehicleNo: 'Total',
          Date: '',
          ToDate: '',
          Distance: `${totalDistance.toFixed(2)} KM`, // Format total distance as needed
        },
      ];

      return dataWithTotal;
    });

    // Add a final "Grand Total" row for all vehicles combined
    formattedData.push({
      VehicleNo: 'Grand Total',
      Date: '',
      ToDate: '',
      Distance: `${grandTotalDistance.toFixed(2)} KM`, // Grand total distance
    });

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Define the columns and rows for the PDF table
    const columns = ['Vehicle No', 'Date', 'To Date', 'Distance'];
    const rows = formattedData.map((entry: any) => [
      entry.VehicleNo,
      entry.Date,
      entry.ToDate,
      entry.Distance,
    ]);

    // Add the title
    doc.setFontSize(18);
    doc.text('Duration Report', 14, 22);

    // Add the table using autoTable with adjusted width and margins
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      tableWidth: 'auto', // Adjusts table width to fit the content
      margin: { top: 20, right: 5, bottom: 20, left: 5 }, // Adjust margins to reduce space on the left and right
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Custom header color
        textColor: [255, 255, 255], // White text
        fontStyle: 'bold',
      },
      theme: 'striped', // Use striped theme
    });

    // Save the PDF
    doc.save('durationReport.pdf');
  }

  distanceToPdf() {
    // Extract table data from the DOM
    const tableElement = this.table.nativeElement;
    const headers = Array.from(tableElement.querySelectorAll('thead th')).map((th: any) => th.innerText);
    const rows = Array.from(tableElement.querySelectorAll('tbody tr')).map((tr: any) =>
      Array.from(tr.querySelectorAll('td')).map((td: any) => td.innerText)
    );

    // Create a new jsPDF instance with a larger page size (e.g., A3) and landscape orientation
    const doc: any = new jsPDF({ orientation: 'landscape', format: 'a3' });

    // Add the title
    doc.setFontSize(18);
    doc.text('Distance Report', 14, 22);

    // Define chunk size for breaking down large data sets
    const chunkSize = 50; // Adjust chunk size based on performance needs

    // Loop through the data in chunks to handle larger datasets efficiently
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);

      // Add each chunk of data to the table with auto pagination
      autoTable(doc, {
        head: [headers], // Table headers
        body: chunk, // Current chunk of rows
        startY: doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 30, // Positioning after the last table
        tableWidth: 'auto', // Adjusts table width to fit the content
        margin: { top: 20, right: 5, bottom: 20, left: 5 }, // Margins
        styles: {
          fontSize: 7, // Smaller font size for better fit
          cellPadding: 2, // Reduced cell padding
        },
        headStyles: {
          fillColor: [22, 160, 133], // Custom header color
          textColor: [255, 255, 255], // White text
          fontStyle: 'bold',
        },
        theme: 'striped', // Use striped theme
        pageBreak: 'auto', // Automatic page breaks
      });
    }

    // Save the PDF
    doc.save('distanceReport.pdf');
  }
}