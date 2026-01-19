import { formatDate } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminDashboardService } from 'src/app/features/admin/dashboard/dashboard-manage/services/admin-dashboard.service';
import { SharedService } from 'src/app/features/http-services/shared.service';
import { ReportManageService } from '../../services/report-manage.service';
import { catchError, of, tap } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/features/shared/components/confirmation-dialog/confirmation-dialog.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ReportManageListComponent } from '../report-manage-list/report-manage-list.component';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';

@Component({
  selector: 'app-report-manage-filter',
  templateUrl: './report-manage-filter.component.html',
  styleUrls: ['./report-manage-filter.component.scss'],
})
export class ReportManageFilterComponent {
  @ViewChild('ReportsDetails', { static: true })
  ReportsDetails!: ReportManageListComponent;
  dealerData: any;
  selectedDealer: any;
  selectedDealerId: any;
  customerData: any;
  selectedCustomer: any;
  reportForm!: FormGroup;
  vehicleData: any;
  selectedVehicle: any;
  deviceData: any = [];
  spinnerLoading: boolean = false;
  reportTypeMapping: any;
  modalRef!: BsModalRef;
  alertTrigger: any = false;
  isLocation: boolean = false;
  movementcontrol: boolean = false;
  selectedVehicles: any[] = [];
  messageAlert: any = 'warning';
  alertData: any = {
    message:
      ' Note 1 :- Please Wait For Location To Be Fetched , Note 2 :- Select All For All Data In Excel  ',
  };
  showMessage: string =
    'Something went wrong! Please try again with proper input';

  selectDate = [
    { id: 1, dateValue: 'Today' },
    { id: 2, dateValue: 'Yesterday' },
    { id: 3, dateValue: 'Weekly' },
    { id: 6, dateValue: 'Custom' },
  ];
  selectLocation = [
    { id: 1, value: 'Without Location' },
    { id: 2, value: 'With Location' },
  ];
  bulk = [
    {
      id: 1,
      title: 'Distance',
    },
    // {
    //   id: 2,
    //   title: 'Stop',
    // },
    {
      id: 3,
      title: 'Idle',
    },
    {
      id: 4,
      title: 'Trip Report',
    },
    {
      id: 5,
      title: 'Overspeed Report',
    },
    {
      id: 6,
      title: 'GeoFence Report',
    },
    {
      id: 7,
      title: 'Duration Report',
    },
    // {
    //   id: 8,
    //   title: 'AC Report',
    // },
    // {
    //   id: 9,
    //   title: 'Temperature Report',
    // },
    {
      id: 10,
      title: 'Movement Summary',
    },
  ];
  durationcontrol: any;
  data: any;
  customDate: boolean = false;
  timeformate: boolean = false;
  formValueData: any;
  selectDealerCustomer: any;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private dashboardService: AdminDashboardService,
    private repotManageService: ReportManageService,
    private modalService: BsModalService,
    private storageService: StorageService,
    private deviceManageService: DeviceManageService
  ) {}

  ngOnInit() {
    // Skip dealer/customer - directly load vehicles from device API
    this.loadVehiclesDirectly();
    this.setInitialValue();
  }

  loadVehiclesDirectly() {
    this.deviceManageService.getDeviceList().subscribe({
      next: (res: any) => {
        if (res?.status === 200 && res?.body?.result === true) {
          const allDevices = res?.body?.data || [];
          const vehicleMap = new Map();
          allDevices.forEach((device: any) => {
            if (device.vehicleNo && !vehicleMap.has(device.vehicleNo)) {
              vehicleMap.set(device.vehicleNo, {
                value: device.id,
                text: device.vehicleNo
              });
            }
          });
          this.vehicleData = Array.from(vehicleMap.values());
        } else {
          this.vehicleData = [];
        }
      },
      error: (error: any) => {
        this.vehicleData = [];
      }
    });
  }

  setInitialValue() {
    const currentDate = new Date();
    const currentDayStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    currentDayStart.setHours(0, 0, 1);

    const currentDayEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    currentDayEnd.setHours(23, 59, 59);

    this.reportForm = this.fb.group({
      dealer: [''], 
      customer: [''], 
      vehicle: [[], [Validators.required]],
      filtername: [null, [Validators.required]],
      speed: [0],
      fromDate: [currentDayStart, [Validators.required]],
      toDate: [currentDayEnd, [Validators.required]],
      timeformat: ['Today', [Validators.required]],
      locationType: [1],
      vehicledata: [null],
      movement: [0],
    });

    this.reportForm.get('filtername')?.valueChanges.subscribe((value) => {
      const speedControl = this.reportForm.get('speed');
      const movementControl = this.reportForm.get('movement');
      const vehicleDataControl = this.reportForm.get('vehicledata');
      const vehicleControl = this.reportForm.get('vehicle');
      if (value === 'Overspeed Report') {
        speedControl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        speedControl?.clearValidators();
      }
      speedControl?.updateValueAndValidity();

      if (value === 'Movement Summary') {
        movementControl?.setValidators([Validators.required, Validators.min(1)]);
        vehicleDataControl?.setValidators([Validators.required]);
        vehicleControl?.clearValidators();

      } else {
        movementControl?.clearValidators();
        vehicleDataControl?.clearValidators();
        vehicleControl?.setValidators([Validators.required]);

      }
      movementControl?.updateValueAndValidity();
      vehicleDataControl?.updateValueAndValidity();
      vehicleControl?.updateValueAndValidity();

    });

    this.reportForm.get('timeformat')?.valueChanges.subscribe((value) => {
      if (value === 'Custom') {
        this.reportForm.get('fromDate')?.setValue(currentDayStart);
        this.reportForm.get('toDate')?.setValue(currentDayEnd);
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
        this.reportForm.get('fromDate')?.setValue(newFromDate);
        this.reportForm.get('toDate')?.setValue(newToDate);
      }
    });

    this.reportForm.get('vehicle')?.valueChanges.subscribe((value) => {
      this.selectedVehicles = value;
    });
  }

  timecheck(event: any) {
    if (event === 'Custom') {
      this.customDate = true;
    } else {
      this.customDate = false;
    }
  }

  Confirm(event: any) {
    this.page = event.pageNumber;
    this.tableSize = event.pageSize;
    this.submit(this.formValueData, '');
  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      if (this.dealerData && this.dealerData.length > 0) {
        this.selectedDealer =
          this.selectDealerCustomer && this.selectDealerCustomer?.dealer
            ? this.selectDealerCustomer?.dealer
            : this.dealerData[0].Id;
        this.getCustomerData(this.selectedDealer);
        this.reportForm.controls['dealer'].setValue(this.selectedDealer);
      }
    });
  }
  onDealerSelect(dealerId: any) {
    this.selectDealerCustomer = null;
    this.reportForm.controls['customer'].setValue(null);
    this.getCustomerData(dealerId);
  }

  onItemSelect(event: any) {
    this.durationcontrol = event === 'Overspeed Report';
    this.ReportsDetails.setData(this.data, '', '', '', '');
    if (
      event == 'Stop' ||
      event == 'Idle' ||
      event == 'Trip Report' ||
      event == 'Overspeed Report' ||
      event == 'Movement Summary'
    ) {
      this.isLocation = true;
    } else {
      this.isLocation = false;
    }

    if (event == 'Movement Summary') {
      this.movementcontrol = true;
      this.selectedVehicles = [];
      this.reportForm.controls['vehicle'].setValue([]);
      this.reportForm.controls['vehicledata'].setValue(null);
    } else {
      this.movementcontrol = false;
    }
  }

  onVehicleSelect(event: any) {
    this.ReportsDetails.setData(this.data, '', '', '', '');

    if (!event) {
      this.deviceData = [];
      return;
    }

    const selectedVehicleObj = this.vehicleData?.find((vehicle: any) => vehicle.value === event);

    if (selectedVehicleObj && selectedVehicleObj.text) {
      const vehicleNo = selectedVehicleObj.text;

      this.deviceManageService.getDeviceList().subscribe({
        next: (res: any) => {
          if (res?.status === 200 && res?.body?.result === true) {
            const allDevices = res?.body?.data || [];
            this.deviceData = allDevices.filter((device: any) => device.vehicleNo === vehicleNo);
          } else {
            this.deviceData = [];
          }
        },
        error: (error: any) => {
          this.deviceData = [];
        }
      });
    } else {
      this.deviceData = [];
    }
  }

  getCustomerData(id: any) {
    this.selectedDealerId = id;
    this.dashboardService.customer(id).subscribe((res: any) => {
      this.customerData = res?.body?.Result?.Data;
      if (this.customerData && this.customerData.length > 0) {
        this.selectedCustomer =
          this.selectDealerCustomer && this.selectDealerCustomer?.customer
            ? this.selectDealerCustomer?.customer
            : this.customerData[0].Id;
        this.getVehicleData(this.selectedCustomer);
        this.reportForm.controls['customer'].setValue(this.selectedCustomer);
      }
    });
  }
  getVehicleData(id: any) {
    this.loadVehiclesDirectly();
  }

  removeVehicle(vehicle: any) {
    this.ReportsDetails.setData(null, null, null, null, null);
    this.selectedVehicles = this.selectedVehicles.filter((v) => v !== vehicle);
    const selectedValues = this.selectedVehicles.map(
      (vehicle) => vehicle.value
    );
    this.reportForm
      .get('vehicle')
      ?.setValue(this.selectedVehicles, { emitEvent: true });
  }

  onCustomerSelect(customerId: any) {
    this.reportForm.controls['vehicle'].setValue([]);
    this.selectedCustomer = customerId;
    this.reportForm.get('vehicledata')?.setValue(null);
    this.getVehicleData(this.selectedCustomer);
  }
  page = 1;
  count = 0;
  tableSize = 50;

  submit(formValue: any, type: any) {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    this.spinnerLoading = true;
    this.formValueData = formValue;
    let deviceData = this.selectedVehicles.map((val) => val.value);

    // Format dates with timezone as per reference project format: "2026-01-16T00:00:00+05:30"
    const formatDateWithTimezone = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      // Get timezone offset in hours and minutes
      const offset = -date.getTimezoneOffset();
      const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
      const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');
      const offsetSign = offset >= 0 ? '+' : '-';
      
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
    };

    const fromDate = new Date(formValue.fromDate);
    const toDate = new Date(formValue.toDate);
    const fromDateISO = formatDateWithTimezone(fromDate);
    const toDateISO = formatDateWithTimezone(toDate);

    // Use FromTime/ToTime for reports that need it, FromDate/ToDate for Distance only
    const useTimeFields = formValue.filtername === 'Stop' || 
                         formValue.filtername === 'Idle' || 
                         formValue.filtername === 'Trip Report' || 
                         formValue.filtername === 'Overspeed Report' || 
                         formValue.filtername === 'GeoFence Report' ||
                         formValue.filtername === 'temperature Report' ||
                         formValue.filtername === 'Duration Report' ||
                         formValue.filtername === 'Movement Summary';

    let payload: any = {
      DeviceId:
        formValue.filtername === 'Distance' ||
          formValue.filtername === 'Stop' ||
          formValue.filtername === 'Idle' ||
          formValue.filtername === 'Trip Report' ||
          formValue.filtername === 'Overspeed Report' ||
          formValue.filtername === 'Duration Report' ||
          formValue.filtername === 'temperature Report' ||
          formValue.filtername === 'GeoFence Report'
          ? (deviceData.length === 1 ? deviceData[0] : deviceData)
          : formValue.filtername === 'Movement Summary'
            ? Number(formValue?.vehicledata)
            : (deviceData.length === 1 ? deviceData[0] : deviceData),
      ...(useTimeFields ? {
        FromTime: fromDateISO,
        ToTime: toDateISO
      } : {
        FromDate: fromDateISO,
        ToDate: toDateISO
      }),
      ...(this.durationcontrol && { SpeedLimit: formValue.speed }),
    };

    if (
      formValue.filtername === 'Stop' ||
      formValue.filtername === 'Idle' ||
      formValue.filtername === 'Trip Report' ||
      formValue.filtername === 'Overspeed Report' ||
      formValue.filtername === 'temperature Report' ||
      formValue.filtername === 'GeoFence Report'
    ) {
      payload['limit_count'] = this.tableSize;
      payload['page_num'] = this.page;
    } else if (formValue.filtername === 'Distance') {
      // CustomerId only needed if customer field is filled
      if (formValue.customer) {
      payload['CustomerId'] = formValue.customer;
      }
      payload['limit_count'] = this.tableSize;
      payload['page_num'] = this.page;
    } else if (formValue.filtername === 'Duration Report') {
      // Duration Report uses deviceId (lowercase) as array
      payload['deviceId'] = Array.isArray(payload.DeviceId) ? payload.DeviceId : [payload.DeviceId];
      delete payload.DeviceId; // Remove old key
      // No pagination needed for Duration Report
    }

    // Special handling for Movement Summary - use history endpoint
    if (formValue.filtername === 'Movement Summary') {
      // Convert DeviceId to string for history API
      let deviceIdValue: any;
      if (Array.isArray(payload.DeviceId) && payload.DeviceId.length > 0) {
        deviceIdValue = payload.DeviceId[0];
      } else {
        deviceIdValue = payload.DeviceId;
      }
      
      // Create clean payload for history API
      const cleanPayload: any = {
        DeviceId: String(deviceIdValue),
        FromTime: payload.FromTime || payload.FromDate, // Ensure we use FromTime
        ToTime: payload.ToTime || payload.ToDate, // Ensure we use ToTime
        MovementDuration: formValue.movement
      };
      
      // Replace payload with clean version to avoid duplicates
      Object.keys(payload).forEach(key => delete payload[key]);
      Object.assign(payload, cleanPayload);
    }

    // Special handling for GeoFence Report - clean payload to avoid duplicates
    if (formValue.filtername === 'GeoFence Report') {
      let deviceIdValue: any;
      if (Array.isArray(payload.DeviceId) && payload.DeviceId.length > 0) {
        deviceIdValue = payload.DeviceId[0];
      } else {
        deviceIdValue = payload.DeviceId;
      }
      
      // Create clean payload for GeoFence API
      const cleanPayload: any = {
        DeviceId: deviceIdValue,
        FromTime: payload.FromTime || payload.FromDate, // Ensure we use FromTime
        ToTime: payload.ToTime || payload.ToDate, // Ensure we use ToTime
        limit_count: payload.limit_count || this.tableSize,
        page_num: payload.page_num || this.page
      };
      
      // Replace payload with clean version to avoid duplicates
      Object.keys(payload).forEach(key => delete payload[key]);
      Object.assign(payload, cleanPayload);
    }

    this.reportTypeMapping = {
      Stop: 'reports/StopReport',
      Idle: 'reports/IdleReport',
      Distance: 'reports/DistanceReport',
      'Trip Report': 'reports/TripReport',
      'Overspeed Report': 'reports/OverSpeedReport',
      'GeoFence Report': 'reports/Geofence', 
      'Temperature Report': 'reports/TempReport',
      'AC Report': 'reports/AcReport',
      'Duration Report': 'reports/distancereport/summary', 
      'Movement Summary': 'history', 
    };

    const reportType = this.reportTypeMapping[formValue.filtername];

    if (reportType) {
      this.repotManageService
        .allReportTypeDynamically(payload, reportType)
        .pipe(
          tap((res: any) => {
            this.spinnerLoading = false;

            // Handle error responses - show empty table instead of popup
            if (res?.error || (res?.body && res?.body?.result === false)) {
              // Set empty data structure based on report type to show empty table
              if (formValue.filtername === 'Stop' || formValue.filtername === 'Idle') {
                this.data = { Points: [], TotalCount: 0 };
              } else if (formValue.filtername === 'Trip Report' || formValue.filtername === 'Overspeed Report') {
                this.data = { Points: [], TotalCount: 0 };
              } else if (formValue.filtername === 'Movement Summary') {
                this.data = { Vehicle: { VehicleNo: '' }, Result: [] };
              } else if (formValue.filtername === 'GeoFence Report') {
                this.data = [];
              } else if (formValue.filtername === 'Distance') {
                this.data = [];
              } else if (formValue.filtername === 'Duration Report') {
                this.data = [];
              } else {
                this.data = null;
              }
              
              this.ReportsDetails.setData(
                this.data,
                formValue.filtername,
                formValue,
                type,
                this.isLocation
              );
              return;
            }

            
            let reportData = res?.body?.data || res?.body?.Data || res?.data;

            // Check if result is successful - show empty table instead of popup
            if (res?.body?.result === false || (res?.body?.result === undefined && !reportData)) {
              // Set empty data structure based on report type to show empty table
              if (formValue.filtername === 'Stop' || formValue.filtername === 'Idle') {
                this.data = { Points: [], TotalCount: 0 };
              } else if (formValue.filtername === 'Trip Report' || formValue.filtername === 'Overspeed Report') {
                this.data = { Points: [], TotalCount: 0 };
              } else if (formValue.filtername === 'Movement Summary') {
                this.data = { Vehicle: { VehicleNo: '' }, Result: [] };
              } else if (formValue.filtername === 'GeoFence Report') {
                this.data = [];
              } else if (formValue.filtername === 'Distance') {
                this.data = [];
              } else if (formValue.filtername === 'Duration Report') {
                this.data = [];
              } else {
                this.data = null;
              }
              
              this.ReportsDetails.setData(
                this.data,
                formValue.filtername,
                formValue,
                type,
                this.isLocation
              );
              return;
            }

            // Special case for Distance Report - transform data structure
            if (formValue.filtername === 'Distance') {
              if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
                // Set empty data structure to show empty table
                this.data = [];
                this.ReportsDetails.setData(
                  this.data,
                  formValue.filtername,
                  formValue,
                  type,
                  this.isLocation
                );
                return;
              }

              // Transform the flat structure to match expected format
              // Group by vehicleNo
              const vehicleMap = new Map();
              reportData.forEach((item: any) => {
                const vehicleNo = item.vehicleNo || item.VehicleNo;
                const deviceId = item.fkDeviceId || item.DeviceId || item.deviceId;
                
                if (!vehicleMap.has(vehicleNo)) {
                  vehicleMap.set(vehicleNo, {
                    Device: {
                      VehicleNo: vehicleNo,
                      Id: deviceId
                    },
                    Distance: [],
                    Total: 0
                  });
                }
                
                const vehicle = vehicleMap.get(vehicleNo);
                const distance = parseFloat(item.distance || item.Distance || 0);
                
                vehicle.Distance.push({
                  Date: item.dateDis || item.Date || item.fromTime || item.FromTime,
                  Distance: distance,
                  ToDate: item.toTime || item.ToTime
                });
                vehicle.Total += distance;
              });

              // Convert map to array and format Total
              this.data = Array.from(vehicleMap.values()).map((vehicle: any) => ({
                ...vehicle,
                Total: parseFloat(vehicle.Total.toFixed(2))
              }));
            }
            // Special case for Idle Report - transform response structure
            else if (formValue.filtername === 'Idle') {
              if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
                // Set empty data structure to show empty table
                this.data = { Points: [], TotalCount: 0 };
                this.ReportsDetails.setData(
                  this.data,
                  formValue.filtername,
                  formValue,
                  type,
                  this.isLocation
                );
                return;
              }

              // Transform flat structure to expected format with Points array
              const points: any[] = [];
              
              reportData.forEach((item: any) => {
                const vehicleNo = item.vehicleNo || item.VehicleNo;
                
                // Calculate duration in seconds
                const startTime = new Date(item.dormantStart || item.DormantStart || item.StartTime);
                const endTime = new Date(item.dormantEnd || item.DormantEnd || item.EndTime);
                const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
                
                // Format duration as HH:MM:SS
                const hours = Math.floor(durationSeconds / 3600);
                const minutes = Math.floor((durationSeconds % 3600) / 60);
                const seconds = durationSeconds % 60;
                const duration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                
                points.push({
                  VehicleNo: vehicleNo,
                  StartTime: item.dormantStart || item.DormantStart || item.StartTime,
                  EndTime: item.dormantEnd || item.DormantEnd || item.EndTime,
                  Duration: duration,
                  Loc: {
                    Lat: item.latitude || item.Latitude || item.Lat,
                    Lng: item.longitude || item.Longitude || item.Lng
                  }
                });
              });

              // Structure expected by list component: { Points: [...], TotalCount: number }
              this.data = {
                Points: points,
                TotalCount: points.length
              };
            }
            // Special case for Trip Report - transform response structure
            else if (formValue.filtername === 'Trip Report') {
              if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
                // Set empty data structure to show empty table
                this.data = { Points: [], TotalCount: 0 };
                this.ReportsDetails.setData(
                  this.data,
                  formValue.filtername,
                  formValue,
                  type,
                  this.isLocation
                );
                return;
              }

              // Transform flat structure to expected format with Points array
              const points: any[] = [];
              
              reportData.forEach((item: any) => {
                const vehicleNo = item.vehicleNo || item.VehicleNo;
                
                // Calculate duration in seconds
                const startTime = new Date(item.tripStartTime || item.TripStartTime || item.StartTime);
                const endTime = new Date(item.tripEndTime || item.TripEndTime || item.EndTime);
                const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
                
                // Format duration as HH:MM:SS
                const hours = Math.floor(durationSeconds / 3600);
                const minutes = Math.floor((durationSeconds % 3600) / 60);
                const seconds = durationSeconds % 60;
                const duration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                
                // Get distance, ensure it's positive (handle negative values)
                const distance = Math.abs(parseFloat(item.distance || item.Distance || 0));
                
                points.push({
                  Device: vehicleNo, // Used for grouping
                  StartTime: item.tripStartTime || item.TripStartTime || item.StartTime,
                  EndTime: item.tripEndTime || item.TripEndTime || item.EndTime,
                  Duration: duration,
                  Distance: distance,
                  Start: {
                    Lat: item.startLat || item.StartLat || item.startLatitude || item.StartLatitude,
                    Lng: item.startLng || item.StartLng || item.startLongitude || item.StartLongitude
                  },
                  End: {
                    Lat: item.endLat || item.EndLat || item.endLatitude || item.EndLatitude,
                    Lng: item.endLng || item.EndLng || item.endLongitude || item.EndLongitude
                  }
                });
              });

              // Structure expected by list component: { Points: [...], TotalCount: number }
              this.data = {
                Points: points,
                TotalCount: points.length
              };
            }
            // Special case for Overspeed Report - transform response structure
            else if (formValue.filtername === 'Overspeed Report') {
              if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
                // Set empty data structure to show empty table
                this.data = { Points: [], TotalCount: 0 };
                this.ReportsDetails.setData(
                  this.data,
                  formValue.filtername,
                  formValue,
                  type,
                  this.isLocation
                );
                return;
              }

              // Transform flat structure to expected format with Points array
              const points: any[] = [];
              
              reportData.forEach((item: any) => {
                const vehicleNo = item.vehicleNo || item.VehicleNo;
                
                // Calculate duration in seconds
                const startTime = new Date(item.speedStartTime || item.SpeedStartTime || item.StartTime);
                const endTime = new Date(item.speedEndTime || item.SpeedEndTime || item.EndTime);
                const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
                
                // Format duration as HH:MM:SS
                const hours = Math.floor(durationSeconds / 3600);
                const minutes = Math.floor((durationSeconds % 3600) / 60);
                const seconds = durationSeconds % 60;
                const duration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                
                // Get distance, ensure it's positive (handle negative values)
                const distance = Math.abs(parseFloat(item.distance || item.Distance || 0));
                const startSpeed = parseFloat(item.startSpeed || item.StartSpeed || 0);
                
                points.push({
                  VehicleNo: vehicleNo, // Used for grouping
                  StartTime: item.speedStartTime || item.SpeedStartTime || item.StartTime,
                  EndTime: item.speedEndTime || item.SpeedEndTime || item.EndTime,
                  Duration: duration,
                  Distance: distance,
                  StartSpeed: startSpeed,
                  StartLoc: {
                    Lat: item.startLat || item.StartLat || item.startLatitude || item.StartLatitude,
                    Lng: item.startLng || item.StartLng || item.startLongitude || item.StartLongitude
                  },
                  EndLoc: {
                    Lat: item.endLat || item.EndLat || item.endLatitude || item.EndLatitude,
                    Lng: item.endLng || item.EndLng || item.endLongitude || item.EndLongitude
                  }
                });
              });

              // Structure expected by list component: { Points: [...], TotalCount: number }
              this.data = {
                Points: points,
                TotalCount: points.length
              };
            }
            // Special case for Movement Summary - transform history API response
            else if (formValue.filtername === 'Movement Summary') {
              if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
                // Set empty data structure to show empty table
                this.data = { Vehicle: { VehicleNo: '' }, Result: [] };
                this.ReportsDetails.setData(
                  this.data,
                  formValue.filtername,
                  formValue,
                  type,
                  this.isLocation
                );
                return;
              }

              // Helper function to calculate distance between two coordinates (Haversine formula)
              const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
                const R = 6371; // Radius of the Earth in km
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = 
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
              };

              const movementDuration = formValue.movement || 2; // Default to 2 minutes
              const movementThreshold = movementDuration * 60 * 1000; // Convert to milliseconds
              const vehicleNo = reportData[0]?.vehicleNo || reportData[0]?.VehicleNo || '';

              
              const segments: any[] = [];
              let currentSegment: any = null;
              let segmentStartIndex = 0;

              for (let i = 0; i < reportData.length; i++) {
                const point = reportData[i];
                const nextPoint = reportData[i + 1];
                
                // Check if vehicle is moving (speed > 0 or has moved position)
                const isMoving = (point.speed > 0) || 
                                (nextPoint && (
                                  point.latitude !== nextPoint.latitude || 
                                  point.longitude !== nextPoint.longitude
                                ));

                if (isMoving) {
                  if (!currentSegment) {
                    // Start new segment
                    currentSegment = {
                      startTime: new Date(point.timestamp || point.serverTime || point.Timestamp),
                      startPoint: { Lat: point.latitude, Lng: point.longitude },
                      totalDistance: 0
                    };
                    segmentStartIndex = i;
                  }
                  
                  // Add distance if moving to next point
                  if (nextPoint) {
                    const distance = calculateDistance(
                      point.latitude,
                      point.longitude,
                      nextPoint.latitude,
                      nextPoint.longitude
                    );
                    currentSegment.totalDistance += distance;
                  }
                } else {
                  // Vehicle stopped - check if segment duration meets threshold
                  if (currentSegment) {
                    const endPoint = reportData[i - 1] || point;
                    const segmentDuration = new Date(endPoint.timestamp || endPoint.serverTime || endPoint.Timestamp).getTime() - 
                                          currentSegment.startTime.getTime();
                    
                    if (segmentDuration >= movementThreshold && currentSegment.totalDistance > 0) {
                      segments.push({
                        StartTime: currentSegment.startTime.toISOString(),
                        EndTime: (endPoint.timestamp || endPoint.serverTime || endPoint.Timestamp),
                        StartPoint: currentSegment.startPoint,
                        EndPoint: {
                          Lat: endPoint.latitude,
                          Lng: endPoint.longitude
                        },
                        Distance: parseFloat(currentSegment.totalDistance.toFixed(2))
                      });
                    }
                    currentSegment = null;
                  }
                }
              }

              // Handle last segment if vehicle was moving at the end
              if (currentSegment && segments.length > 0) {
                const lastPoint = reportData[reportData.length - 1];
                const segmentDuration = new Date(lastPoint.timestamp || lastPoint.serverTime).getTime() - 
                                      currentSegment.startTime.getTime();
                
                if (segmentDuration >= movementThreshold && currentSegment.totalDistance > 0) {
                  segments.push({
                    StartTime: currentSegment.startTime.toISOString(),
                    EndTime: (lastPoint.timestamp || lastPoint.serverTime),
                    StartPoint: currentSegment.startPoint,
                    EndPoint: {
                      Lat: lastPoint.latitude,
                      Lng: lastPoint.longitude
                    },
                    Distance: parseFloat(currentSegment.totalDistance.toFixed(2))
                  });
                }
              }

              if (segments.length === 0) {
                // Set empty data structure to show empty table
                this.data = { Vehicle: { VehicleNo: vehicleNo }, Result: [] };
                this.ReportsDetails.setData(
                  this.data,
                  formValue.filtername,
                  formValue,
                  type,
                  this.isLocation
                );
                return;
              }

            
              this.data = {
                Vehicle: {
                  VehicleNo: vehicleNo
                },
                Result: segments
              };
            }
            // Special case for GeoFence Report - transform response structure
            else if (formValue.filtername === 'GeoFence Report') {
              if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
                // Set empty data structure to show empty table
                this.data = [];
                this.ReportsDetails.setData(
                  this.data,
                  formValue.filtername,
                  formValue,
                  type,
                  this.isLocation
                );
                return;
              }

              // Transform flat structure to expected format - group by vehicleNo
              const vehicleMap = new Map();
              
              reportData.forEach((item: any) => {
                const vehicleNo = item.vehicleNo || item.VehicleNo;
                
                if (!vehicleMap.has(vehicleNo)) {
                  vehicleMap.set(vehicleNo, {
                    VehicleNo: vehicleNo,
                    Points: []
                  });
                }
                
                const vehicle = vehicleMap.get(vehicleNo);
                
                // Calculate duration in seconds
                const inTime = new Date(item.geofenceInTime || item.GeofenceInTime || item.StartTime);
                const outTime = new Date(item.geofenceOutTime || item.GeofenceOutTime || item.EndTime);
                const durationSeconds = Math.floor((outTime.getTime() - inTime.getTime()) / 1000);
                
                // Format duration as HH:MM:SS
                const hours = Math.floor(durationSeconds / 3600);
                const minutes = Math.floor((durationSeconds % 3600) / 60);
                const seconds = durationSeconds % 60;
                const duration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                
                vehicle.Points.push({
                  VehicleNo: vehicleNo,
                  StartTime: item.geofenceInTime || item.GeofenceInTime || item.StartTime,
                  EndTime: item.geofenceOutTime || item.GeofenceOutTime || item.EndTime,
                  Duration: duration,
                  GeofenceName: item.geofenceInName || item.GeofenceInName || item.geofenceName || item.GeofenceName || 'Unknown'
                });
              });

              // Convert map to array - structure expected by groupingGeofence: [{ VehicleNo, Points: [...] }]
              this.data = Array.from(vehicleMap.values());
            }
            // Special case for Duration Report - transform summary response structure
            else if (formValue.filtername === 'Duration Report') {
              if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
                // Set empty data structure to show empty table
                this.data = [];
                this.ReportsDetails.setData(
                  this.data,
                  formValue.filtername,
                  formValue,
                  type,
                  this.isLocation
                );
                return;
              }

              // Transform response from summary API to expected format
              const transformedData = reportData.map((item: any) => {
                const vehicleNo = item.vehicleNo || item.VehicleNo;
                const deviceId = item.deviceId || item.DeviceId;
                
                // Transform distanceRecords array
                const distanceArray = (item.distanceRecords || item.DistanceRecords || []).map((record: any) => {
                  // Calculate ToDate - it's the next day's start or use toTime
                  const reportDate = new Date(record.reportDate || record.Date);
                  const nextDay = new Date(reportDate);
                  nextDay.setDate(nextDay.getDate() + 1);
                  
                  return {
                    Date: record.reportDate || record.Date || item.fromTime,
                    ToDate: record.toDate || nextDay.toISOString() || item.toTime,
                    Distance: parseFloat(record.distance || record.Distance || 0)
                  };
                });

                return {
                  Device: {
                    VehicleNo: vehicleNo,
                    Id: deviceId
                  },
                  Distance: distanceArray,
                  Total: parseFloat((item.total || item.Total || 0).toFixed(2))
                };
              });

              this.data = transformedData;
            } else {
              // Generic check for all filter types
              if (!reportData || (Array.isArray(reportData) && reportData.length === 0)) {
                // Set empty data structure to show empty table
                this.data = null;
                this.ReportsDetails.setData(
                  this.data,
                  formValue.filtername,
                  formValue,
                  type,
                  this.isLocation
                );
                return;
              }
              this.data = reportData;
            }

            // Set the data if available
            this.ReportsDetails.setData(
              this.data,
              formValue.filtername,
              formValue,
              type,
              this.isLocation
            );
          }),
          catchError((error) => {
            this.spinnerLoading = false;
            console.error('Report API error:', error);

            // Set empty data structure based on report type to show empty table
            if (this.formValueData?.filtername === 'Stop' || this.formValueData?.filtername === 'Idle') {
              this.data = { Points: [], TotalCount: 0 };
            } else if (this.formValueData?.filtername === 'Trip Report' || this.formValueData?.filtername === 'Overspeed Report') {
              this.data = { Points: [], TotalCount: 0 };
            } else if (this.formValueData?.filtername === 'Movement Summary') {
              this.data = { Vehicle: { VehicleNo: '' }, Result: [] };
            } else if (this.formValueData?.filtername === 'GeoFence Report') {
              this.data = [];
            } else if (this.formValueData?.filtername === 'Distance') {
              this.data = [];
            } else if (this.formValueData?.filtername === 'Duration Report') {
              this.data = [];
            } else {
              this.data = null;
            }
            
            this.ReportsDetails.setData(
              this.data,
              this.formValueData?.filtername || null,
              this.formValueData || null,
              null,
              this.isLocation
            );
            
            return of(null);
          })
        )
        .subscribe();
    }
  }

  openConfirmationModal(data = {}) {
    const initialState: ModalOptions = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: {
        ...data,
      },
    };
    this.modalRef = this.modalService.show(
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
}