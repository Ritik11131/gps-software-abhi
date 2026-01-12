import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';

@Component({
  selector: 'app-customer-device-details',
  templateUrl: './customer-device-details.component.html',
  styleUrls: ['./customer-device-details.component.scss']
})
export class CustomerDeviceDetailsComponent {

  selectedDealer:any;
  selectedCustomer:any;
  device:any;
  bsModalRef!: BsModalRef
  selectedDeviceData: any;
  deviceForm!: FormGroup

  constructor(
    private bsmodalService: BsModalService,
    private deviceManageService : DeviceManageService,
    private fb : FormBuilder,
    private datepipe: DatePipe
  ) {};

  ngOnInit() {    
    this.setInitialValue();

  }

  setInitialValue () {
    this.deviceForm = this.fb.group({
      deviceMaker: [this.device?.Device?.DeviceTypeMeta?.DeviceMakerName, [Validators.required]],
      deviceName: [this.device?.Device?.DeviceTypeMeta?.Name, [Validators.required]],
      imei: [this.device?.Device?.DeviceImei, [Validators.required]],
      installationDate: [this.datepipe.transform(
        this.device?.Device?.InstallationDate,
        'dd/MM/yyyy'
      ), [Validators.required]],
      deviceUid: [this.device?.Device?.DeviceUId, [Validators.required]],
      description: ['', [Validators.required]],
      simNo : [this.device?.Device.SimPhoneNumber, [Validators.required]],
      vehicleNo: [this.device?.Device.VehicleNo, [Validators.required]],
    })
  }

  getDeviceData() {
    this.deviceManageService.deviceById(this.selectedDealer, this.selectedCustomer, this.device?.Device?.Id).subscribe((res: any) => {
      this.selectedDeviceData = res?.body?.Result?.Data
    })
  }

  cancel() {
    this.bsmodalService.hide()
  }
}
