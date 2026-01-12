import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GeofanceService } from '../../services/geofance.service';
import { isArray } from 'ngx-bootstrap/chronos';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { DashboardService } from 'src/app/features/users/dashboard/dashboard-summary/services/dashboard.service';

@Component({
  selector: 'goefance-list',
  templateUrl: './goefance-list.component.html',
  styleUrls: ['./goefance-list.component.scss']
})
export class GoefanceListComponent implements OnInit {
  @Output() onConfirm = new EventEmitter()
  corner: any;
  geoFanceForm!: FormGroup;
  radious: any;
  geoType: any;
  geofanceList: any;
  configuration!: Config;
  columns!: Columns[];
  spinnerLoading: boolean = false
  selectedCustomerId: any;
  selectedGeoFanceId: any;
  selectedData: any;
  button: string = 'Add';
  geofancePoints: any;
  vehicleData: any;

  constructor(
    private fb: FormBuilder,
    private geoservice: GeofanceService,
    private NotificationService: NotificationService,
    private dashboardService : DashboardService
  ) { }

  ngOnInit() {
    this.getDeviceList()
    this.setInitialValue();
    this.setInitialTable()
    this.getGeoFanceList();
  }

  setInitialTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.checkboxes = false;
    this.configuration.tableLayout.striped = true;
    this.configuration.tableLayout.hover = false;
    this.configuration.paginationRangeEnabled = false;
    this.configuration.paginationEnabled = true;
    this.columns = [
      { key: 'type', title: 'type' },
      { key: 'action', title: 'Action' },
    ];
  }

  setInitialValue() {
    this.geoFanceForm = this.fb.group({
      cornerValue: ['', [Validators.required, Validators.pattern('')]],
      geofancename: [null, [Validators.required, Validators.pattern('')]],
    });


    this.geoFanceForm.get('cornerValue')?.valueChanges.pipe(debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.corner = value;
      this.geoFanceForm.controls['cornerValue'].setValue(value, { emitEvent: false });
    });
  }

  modifycordinate(value: any) {
    let data: any = [];
    if (Array.isArray(value)) {
      value?.forEach((ele: any) => {
        let latlng = {
          "Lat": ele.lat, "Lng": ele.lng
        }
        data.push(latlng);
      })
    } else {
      let latlng = {
        "Lat": value.lat, "Lng": value.lng
      }
      data.push(latlng);
    }
    return data
  }

  submit(formvalue: any) {
    if (this.geoFanceForm.invalid) {
      this.geoFanceForm.markAllAsTouched();
      return;
    }
    let payload: any;
    const newPoints = this.modifycordinate(formvalue.cornerValue);
    const cornerdata = (newPoints.length > 0 && newPoints[0].Lat !== undefined)
      ? newPoints
      : this.geofancePoints;

    payload = {
      "CustomerId": 0,
      "GeomType": this.geoType,
      "Id": 0,
      "Name": formvalue?.geofancename,
      "Points": cornerdata,
      "Radius": this.radious,
      "vechileId": "0",
      "Stypes": "geofenceList1",
    }

    let service = this.geoservice.createGeofance(payload)
    if (this.selectedGeoFanceId) {
      payload['CustomerId'] = this.selectedData?.CustomerId;
      payload['GeomType'] = this.selectedData?.GeomType;
      payload['Id'] = this.selectedData?.Id;
      service = this.geoservice.updateGeofance(payload, this.selectedGeoFanceId)
    }
    service.subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.NotificationService.showInfo(res?.body?.Result?.Data);
        this.getGeoFanceList();
        this.geoFanceForm.reset();
        this.onConfirm.emit('');
        this.button = 'Add';
        this.selectedGeoFanceId = ''
      } else {
        this.NotificationService.showError(res?.error?.Error?.Message[0].ErrorMessage);
      }
    })

  }

  setData(data: string, cricleRadious: any, geotype: any) {
    this.geoFanceForm.patchValue({
      cornerValue: data
    });
    this.radious = cricleRadious;
    this.geoType = geotype
    if (!data) {
      this.geoFanceForm.reset()
    }
  }

  getGeoFanceList() {
    this.spinnerLoading = true;
    this.geoservice.geofanceList().subscribe((res: any) => {
      this.spinnerLoading = false;
      this.geofanceList = res?.body?.Result?.Data
    })
  }

  deletePolygun(data: any) {
    let payload = {
      id: data?.Id
    }
    this.geoservice.deleteGeofance(data?.Id, payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == "Success") {
        this.NotificationService.showSuccess(res?.body?.Result?.Data);
        this.getGeoFanceList();
        this.onConfirm.emit('');
        this.button = 'Add';
        this.selectedGeoFanceId = ''
      } else {
        this.NotificationService.showError(res?.error?.Error?.Data);
      }
    })
  }

  onEditPolygun(data: any) {
    this.button = 'Update'
    this.selectedData = data
    this.selectedGeoFanceId = data?.Id
    this.onConfirm.emit(data);
    this.geofancePoints = data?.Points || [];

    const geofenceName = this.geofancePoints
      ?.map((point: any) => `(${point?.Lat}, ${point?.Lng})`)
      .join(', ');

      if (data?.Name) {
        let newVehicleData = this.vehicleData?.find((ele: any) => ele?.text == data?.Name);
        this.geoFanceForm.patchValue({
          geofancename: newVehicleData?.text
        });
      } else {
        this.geoFanceForm.patchValue({
          geofancename: data?.Name
        });
      }

    this.geoFanceForm = this.fb.group({
      cornerValue: [geofenceName, [Validators.required, Validators.pattern('')]],
    });
  }

  cancel() {
    this.geoFanceForm.reset();
    this.onConfirm.emit(null);
    this.button = 'Add';
    this.selectedGeoFanceId = ''
  }

  getDeviceList() {
    this.dashboardService.vehicleList().subscribe((res: any) => {
      let data = res?.body?.Result?.Data;
      this.vehicleData = data.map((item: any) => {
        return {
          value: item?.Device?.Id,
          text: item?.Device?.VehicleNo,
        };
      });
    });
  }
}