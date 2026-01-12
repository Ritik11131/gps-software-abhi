import { formatDate, LocationStrategy } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { ReportService } from '../../../services/report.service';
import { ReportsDetailsComponent } from '../reports-details/reports-details.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmationDialogComponent } from 'src/app/features/shared/components/confirmation-dialog/confirmation-dialog.component';
import { catchError, of, tap } from 'rxjs';
import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';
import { MatDatepicker } from '@angular/material/datepicker';
import { DashboardService } from 'src/app/features/users/dashboard/dashboard-summary/services/dashboard.service';

@Component({
  selector: 'reports-filter',
  templateUrl: './reports-filter.component.html',
  styleUrls: ['./reports-filter.component.scss'],
})
export class ReportsFilterComponent {
  @ViewChild('ReportsDetails', { static: true })
  ReportsDetails!: ReportsDetailsComponent;
  durationcontrol: boolean = false;
  messageAlert: any = "warning";
  filterForm!: FormGroup;
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
      title: 'Alert Report',
    },
    {
      id: 11,
      title: 'Movement Summary',
    }
  ];
  isMultiple = false;

  data: any;
  vehicleData :any
  reportTypeMapping: any;
  isSpeedGreaterThanZero = false;
  selectDate = [
    { id: 1, dateValue: 'Today' },
    { id: 2, dateValue: 'Yesterday' },
    { id: 3, dateValue: 'Weekly' },
    { id: 6, dateValue: 'Custom' },
  ];
  selectLocation = [
    {id: 1, value: 'Without Location'},
    {id: 2, value: 'With Location'},
  ]
  alertType: any;
  isAlertType: boolean = false;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: any;
  public maxDate: any;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  customDate: boolean = false;
  isShowMessage: boolean = true
  selectVehicle: any;
  selectAllChecked: any;
  page = 1;
  count = 0;
  tableSize = 50;
  tableSizes = [25, 50, 100];
  formValueData: any;
  vehicleStatusValue: any;
  vehicleStateData: any;
  filterType: any;
  alertTrigger: any = false;
  alertData: any = {
    message: " Note 1 :- Please Wait For Location To Be Fetched , Note 2 :- Select All For All Data In Excel  ",
  };
  showMessage: string = 'Something went wrong! Please try again with proper input';
  movementcontrol: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private NotificationService: NotificationService,
    private reportService: ReportService,
    private dashbaordService: DashboardService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private location: LocationStrategy
  ) { }
  currentPath: string = '';
  isLocation:boolean = false;
  ngOnInit() {
    this.vehicleStateData = this.location.getState();
    delete this.vehicleStateData?.navigationId;
    this.getVehicleData();
    this.setInitValue();


    this.route.url.subscribe(url => {
      if (url.length > 1) {
        this.currentPath = url[1].path.replace('-', " ");
        this.isAlertType = false;
        if (this.currentPath === 'report') {
          this.filterForm.get('filtername')?.setValue(null);
          this.durationcontrol = false;
        } else if(this.currentPath === 'Alert Report') {
            this.isAlertType = true; 
            const matchingReport = this.bulk.find(item => item.title === this.currentPath);
            if(matchingReport) {
              this.filterForm.get('filtername')?.setValue(matchingReport.title);
            }
            this.getAlertData();  
        } else {
          const matchingReport = this.bulk.find(item => item.title === this.currentPath);
          if (matchingReport) {
            this.filterForm.get('filtername')?.setValue(matchingReport.title);
            if (matchingReport.title == 'Speed Report') {
              this.durationcontrol = true
            } else if (matchingReport.title == 'Overspeed Report') {
              this.durationcontrol = true
            }
            else {
              this.durationcontrol = false
            }
          }
        }

        if(this.currentPath  == 'Stop' || this.currentPath == 'Idle' || this.currentPath == 'Trip Report' || this.currentPath == 'Overspeed Report' || this.currentPath == 'Movement Summary') {         
          this.isLocation = true;
        } else {
          this.isLocation = false;
        }

        if(this.currentPath == 'Movement Summary'){
          this.movementcontrol = true
          this.selectedVehicles = []
          this.filterForm.controls['vehicle'].setValue([])
          this.filterForm.controls['vehicledata'].setValue(null)
        }else{
          this.movementcontrol = false
        }

      }
    });
  }


  setInitValue() {
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

    this.filterForm = this.fb.group({
      filtername: [null, [Validators.required, Validators.pattern('')]],
      vehicle: [[], [Validators.required, Validators.pattern('')]],
      fromDate: [
        currentDayStart,
        [Validators.required, Validators.pattern('')],
      ],
      toDate: [currentDayEnd, [Validators.required, Validators.pattern('')]],
      speed: [0],
      timeformat: ['Today', [Validators.required]],
      alertId: [null],
      locationType: [1],
      vehicledata:[null],
      movement:[0]
    });

    this.filterForm.get('filtername')?.valueChanges.subscribe((value) => {
      const speedControl = this.filterForm.get('speed');
      const movementControl = this.filterForm.get('movement');
      const vehicleDataControl = this.filterForm.get('vehicledata');
      const vehicleControl = this.filterForm.get('vehicle');
      const alertControl = this.filterForm.get('alertId');

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

      if (value === 'Alert Report') {
        alertControl?.setValidators([Validators.required]);
      } else {
        alertControl?.clearValidators();
      }
      alertControl?.updateValueAndValidity();

    });
    this.filterForm.get('timeformat')?.valueChanges.subscribe((value) => {
      if (value === 'Custom') {
        this.filterForm.get('fromDate')?.setValue(currentDayStart);
        this.filterForm.get('toDate')?.setValue(currentDayEnd);
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
        this.filterForm.get('fromDate')?.setValue(newFromDate);
        this.filterForm.get('toDate')?.setValue(newToDate);
      }
    });

    this.filterForm.get('vehicle')?.valueChanges.subscribe((value) => {
      this.selectedVehicles = value;
    })


    if (this.vehicleStateData?.value && this.vehicleStateData?.text) {
      this.filterForm.patchValue({
        vehicle: [this.vehicleStateData]
      });
    }

  }

  onVehicleSelect(event: any){

  }
  spinnerLoading: boolean = false;

  submit(formValue: any, type: any) {    
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    if (type == 'Report') {
      this.page = 1
    }
    this.formValueData = formValue
    this.spinnerLoading = true;
    let payload: any;
    let service: any;
    let deviceData = this.selectedVehicles.map((val) => val.value)

    payload = {
      DeviceID:
        formValue.filtername === 'Idle' ||
          formValue.filtername === 'Speed Report' ||
          formValue.filtername === 'Overspeed Report' ||
          formValue.filtername === 'GeoFence Report' ||
          formValue.filtername === 'AC Report' ||
          formValue.filtername === 'Alert Report'
          ? deviceData
          : formValue.filtername === 'Movement Summary' ? Number(formValue?.vehicledata) : deviceData,
      FromTime: formatDate(formValue.fromDate, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      ToTime: formatDate(formValue.toDate, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      ...(this.durationcontrol && { SpeedLimit: formValue.speed }),
    };
    if (
      formValue.filtername == 'Speed Report' ||
      formValue.filtername == 'Overspeed Report' ||
      formValue.filtername == 'Trip Report' ||
      formValue.filtername == 'Stop Report' ||
      formValue.filtername == 'Stop' ||
      formValue.filtername == 'Idle' ||
      formValue.filtername === 'GeoFence Report' ||
      formValue.filtername === 'Alert Report'

    ) {
      payload['limit_count'] = this.tableSize;
      payload['page_num'] = this.page;
    }
    if(formValue.filtername === 'Movement Summary'){
      payload['MovementDuration'] = formValue.movement;
    }

    this.reportTypeMapping = {
      Distance: 'Distance',
      Stop: 'Stoppage/StopReport',
      Idle: 'idle/IdleReport',
      'Trip Report': 'Trip/TripReport',
      'Overspeed Report': 'Overspeed/OverSpeedReport',
      'GeoFence Report': 'Geofence/GeofenceReport',
      'Duration Report': 'Distance/v1PostDurationWise',
      'AC Report': 'Ac',
      'Temperature Report': 'Temp',
      'Alert Report': 'Alert',
      'Movement Summary' : 'Movement'
      // 'Overspeed Report':'Overspeed/OverSpeedlimitReport'
    };

    const reportType = this.reportTypeMapping[formValue.filtername];
    service = this.reportService.allReportTypeDynamically(payload, reportType);
    if (reportType == 'Alert') {
      payload['alert_type'] = formValue.alertId;
      service = this.reportService.alertReport(payload);
    }
    if (reportType) {
      service
        .pipe(
          tap((res: any) => {
            this.spinnerLoading = false;

            if (res?.error?.ResponseMessage === 'Failed') {
              let errContent =
                formValue.filtername === 'GeoFence Report'
                  ? res.error.Error.Data
                  : res.error.Error.Message[0]?.ErrorMessage;

              this.openConfirmationModal({
                title: res.error.Error.Name || res.error.Error.Message,
                content: errContent || res?.error?.Error?.Data || this.showMessage,
                primaryActionLabel: 'Ok',
                secondaryActionLabel: false,
                onPrimaryAction: () => {
                  this.hideConfirmationModal();
                },
              });
              this.ReportsDetails.setData(null, null, null, null, null);
              return;
            }

            let reportData = res?.body?.Result?.Data;

            // Special case for GeoFence Report
            if (formValue.filtername === 'GeoFence Report') {
              let geofenceData = reportData?.flatMap((val: any) => val.Points);
              if (!geofenceData || geofenceData.length === 0) {
                this.openConfirmationModal({
                  title: 'Geofence',
                  content: 'No GeoFence found for the given duration',
                  primaryActionLabel: 'Ok',
                  secondaryActionLabel: false,
                  onPrimaryAction: () => {
                    this.hideConfirmationModal();
                  },
                });
                this.ReportsDetails.setData(null, null, null, null, null);
                return;
              }
              this.data = reportData;
            }else if(reportType === 'Alert'){
              this.data = res?.body?.result?.data;
            } else {
              // Generic check for all filter types
              if (!reportData || reportData.length === 0) {
                this.openConfirmationModal({
                  title: formValue.filtername,
                  content: `No data found for ${formValue.filtername}`,
                  primaryActionLabel: 'Ok',
                  secondaryActionLabel: false,
                  onPrimaryAction: () => {
                    this.hideConfirmationModal();
                  },
                });
                this.ReportsDetails.setData(null, null, null, null, null);
                return;
              }
              this.data = reportData;
            }

            // Handle special case for Alert report
            // if (reportType === 'Alert') {
            //   this.data = res?.body?.result?.data;
            // }

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
            return of(null);
          })
        )
        .subscribe();
    }
  }

  hideConfirmationModal() {
    this.modalService.hide('confirmationModal');
  }
  getVehicleData() {
    this.dashbaordService.vehicleList().subscribe((res: any) => {
      let data = res?.body?.Result?.Data;
      this.vehicleData = data.map((item: any) => {
        return {
          value: item?.Device?.Id,
          text: item?.Device?.VehicleNo,
        };
      });
    });
  }

  onItemSelect(event: any) {
    this.isMultiple = false;
    this.isMultiple = [
      'Distance',
      'Duration Report',
      'temperature Report',
      'Trip Report',
      'Stop',
      'Idle',
      'GeoFence Report',
    ].includes(event);
    this.filterType = event
    if (event === 'Speed Report' || event === 'Overspeed Report') {
      this.durationcontrol = true;
    } else {
      this.durationcontrol = false;
    }
    this.isAlertType = event === 'Alert Report';

    if (event == 'Alert Report') {
      this.getAlertData();
    }
    if(event == 'Stop' || event == 'Idle' || event == 'Trip Report' || event == 'Overspeed Report' ||event == 'Movement Summary') {
      this.isLocation = true;
    } else {
      this.isLocation = false;
    }

    if(event == 'Movement Summary'){
      this.movementcontrol = true
      this.selectedVehicles = []
      this.filterForm.controls['vehicle'].setValue([])
      this.filterForm.controls['vehicledata'].setValue(null)
    }else{
      this.movementcontrol = false
    }
    this.ReportsDetails.setData(this.data, '', '', '', '');
  }
  modalRef!: BsModalRef;
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

  getAlertData() {
    this.reportService.alertType().subscribe((res: any) => {
      this.alertType = res?.body?.data;
    });
  }

  timecheck(event: any) {
    if (event === 'Custom') {
      this.customDate = true;
    } else {
      this.customDate = false;
    }
  }

  selectedVehicles: any[] = [];

  onCheckboxChange(event: any, item: any) {
    this.ReportsDetails.setData(null, null, null, null,null);
    // const filterType = this.filterType;

    if (event.target.checked) {

      // if ((filterType === 'Speed Report' || filterType === 'Overspeed Report') && this.selectedVehicles.length > 1) {
      //   alert('You can only select up to 1 vehicle for Speed Report or Overspeed Report.');
      //   event.target.checked = false; // Uncheck the checkbox
      //   return;
      // }
      if (!this.selectedVehicles.some(vehicle => vehicle.value === item.value)) {
        this.selectedVehicles.push(item);
      }
    } else {
      this.selectedVehicles = this.selectedVehicles.filter(vehicle => vehicle.value !== item.value);
    }
    const filterName = this.filterForm.value.filtername;
    if (
      filterName === 'Distance' ||
      filterName === 'Duration Report' ||
      filterName === 'Temperature Report' ||
      filterName === 'Trip Report' ||
      filterName === 'Stop' ||
      filterName === 'Idle' ||
      filterName === 'Speed Report' ||
      filterName === 'GeoFence Report' ||
      filterName === 'Overspeed Report'
    ) {
    }
  }


  removeVehicle(vehicle: any) {
    this.ReportsDetails.setData(null, null, null, null, null);
    this.selectedVehicles = this.selectedVehicles.filter((v) => v !== vehicle);
    const selectedValues = this.selectedVehicles.map(
      (vehicle) => vehicle.value
    );
    this.filterForm
      .get('vehicle')
      ?.setValue(this.selectedVehicles, { emitEvent: true });
  }

  toggleItemSelection(item: any) {
    item.selected = !item.selected;
    this.updateSelectedVehicles();
  }

  areAllSelected(): boolean {
    return this.vehicleData.every((item: any) => item.selected);
  }

  toggleSelectAll() {
    const areAllSelected = this.areAllSelected();
    this.vehicleData.forEach((item: any) => (item.selected = !areAllSelected));
    this.updateSelectedVehicles();
  }

  updateSelectedVehicles() {
    this.selectedVehicles = this.vehicleData.filter(
      (item: any) => item.selected
    );
    const selectedValues = this.selectedVehicles.map(
      (vehicle) => vehicle.value
    );
    this.filterForm
      .get('vehicle')
      ?.setValue(selectedValues, { emitEvent: true });
  }

  selectAll() {
    if (this.selectAllChecked) {
      this.selectedVehicles = [...this.vehicleData];
    } else {
      this.selectedVehicles = [];
      this.vehicleData.forEach((vehicle: any) => (vehicle.selected = false));
    }

    const selectedValues = this.selectedVehicles.map(
      (vehicle) => vehicle.value
    );
    this.filterForm
      .get('vehicle')
      ?.setValue(selectedValues, { emitEvent: true });
  }

  Confirm(event: any) {
    this.page = event.pageNumber
    this.tableSize = event.pageSize
    this.submit(this.formValueData, '')
  }


  isChecked(item: any): boolean {
    const selectedVehicles = this.filterForm.get('vehicle')?.value || [];
    return selectedVehicles.some((v: any) => v.value === item.value);
  }

  isOverspeedConditionMet(): boolean {
    return this.filterForm.value.type === 'Overspeed Report' && this.filterForm.value.speed > 0;
  }


  checkSpeedControl() {
    const speedValue = this.filterForm.get('speed')?.value;
    this.isSpeedGreaterThanZero = speedValue > 0;
  }

  // changeLocation(event:any) {
  //   if(event == 1)
  // }
}
 