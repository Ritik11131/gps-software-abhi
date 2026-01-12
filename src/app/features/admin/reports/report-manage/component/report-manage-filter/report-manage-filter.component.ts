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
    private storageService: StorageService
  ) { }
  ngOnInit() {
    this.getDealerlist();
    this.setInitialValue();
    this.checkDealerCustomer();
  }

  checkDealerCustomer() {
    this.storageService.getItem('adminDealerCustomer').subscribe((res: any) => {
      this.selectDealerCustomer = res;
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
      dealer: ['', [Validators.required]],
      customer: ['', [Validators.required]],
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
    this.dashboardService.customerVehicle(id).subscribe((res: any) => {
      let data = res?.body?.Result?.Data;
      this.vehicleData = data.map((item: any) => {
        return {
          value: item?.Device?.Id,
          text: item?.Device?.VehicleNo,
        };
      });
      this.selectedVehicle = this.vehicleData?.Device?.Id;
    });
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

    let payload = {
      DeviceId:
        formValue.filtername === 'Distance' ||
          formValue.filtername === 'Stop' ||
          formValue.filtername === 'Idle' ||
          formValue.filtername === 'Trip Report' ||
          formValue.filtername === 'Overspeed Report' ||
          formValue.filtername === 'Duration Report' ||
          formValue.filtername === 'temperature Report' ||
          formValue.filtername === 'GeoFence Report'
          ? deviceData
          : formValue.filtername === 'Movement Summary'
            ? Number(formValue?.vehicledata)
            : deviceData,
      FromTime: formatDate(formValue.fromDate, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      ToTime: formatDate(formValue.toDate, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
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
    } else if (
      formValue.filtername === 'Distance' ||
      formValue.filtername === 'Duration Report'
    ) {
      payload['CustomerId'] = formValue.customer;
      payload['limit_count'] = this.tableSize;
      payload['page_num'] = this.page;
    }

    if (formValue.filtername === 'Movement Summary') {
      payload['MovementDuration'] = formValue.movement;
    }

    this.reportTypeMapping = {
      Stop: 'Stoppage/StopReport',
      Idle: 'idle/IdleReport',
      Distance: 'Distance/distanceReport',
      'Trip Report': 'Trip/TripReport',
      'Overspeed Report': 'Overspeed/OverSpeedReport',
      'GeoFence Report': 'Geofence/GeofenceReport',
      'Temperature Report': 'Temp',
      'AC Report': 'Ac',
      'Duration Report': 'Distance/v1PostDurationWise',
      'Movement Summary': 'Movement',
    };

    const reportType = this.reportTypeMapping[formValue.filtername];

    if (reportType) {
      this.repotManageService
        .allReportTypeDynamically(payload, reportType)
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
            if (reportType === 'Alert') {
              this.data = res?.body?.result?.data;
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
