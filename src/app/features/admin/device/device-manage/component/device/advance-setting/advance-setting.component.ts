import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceManageService } from '../../../service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { FillOdometerComponent } from '../fill-odometer/fill-odometer.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-advance-setting',
  templateUrl: './advance-setting.component.html',
  styleUrls: ['./advance-setting.component.scss']
})
export class AdvanceSettingComponent {
  advanceSettingForm: any
  inputData = [{ id: 2, name: 'DI-2' }, { id: 3, name: 'DI-3' }, { id: 4, name: 'DI-4' }, { id: 5, name: 'DI-5' }, { id: 6, name: 'DI-6' }];
  fueltData = [{ id: 1, name: 'AI-1' }, { id: 2, name: 'AI-2' }]
  enableData = [{ id: 1, name: 'Enable' }, { id: 0, name: 'Disable' }]
  routePath: any = 'admin/device/device-manage'
  dealerId: any;
  customerId: any;
  deviceId: any;
  getDeviceMata: any;
  advancedValue: any;
  acFilteredData: any = [];
  doorFilteredData: any = [];
  tempFilterData: any =[];
  bsModalRef!: BsModalRef;
  odometerData: any;
  selectedDevice: any;
  selectedDealer: any;
  selectedCustomer: any;
  device: any

  constructor(
    private router: Router,
    private deviceManageService: DeviceManageService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private refreshCustomerService: RefreshCustomerService,
    private bsmodelService: BsModalService
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('CustomerId');
      this.deviceId = params.get('deviceId')
      if (this.deviceId) {
        this.getdeviceMetaById()
      }
    });

    this.acFilteredData = [...this.inputData];
    this.doorFilteredData = [...this.inputData];
    this.tempFilterData =  [...this.fueltData];
  }

  ngOnInit() {
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("CustomerId");
    this.deviceId = this.activeRoute.snapshot.paramMap.get('deviceId');
    if (this.deviceId) {
      this.getdeviceMetaById()
    }
    if (this.selectedDealer) {
      this.dealerId = this.selectedDealer;
      this.customerId = this.selectedCustomer;
      this.deviceId = this.device;
      this.getdeviceMetaById()
    }
    this.setInitialValue()
  }


  setInitialValue() {
    this.advanceSettingForm = this.fb.group({
      simImei: ['', [Validators.required]],
      ignition: [1],
      ac: [null],
      door: [null],
      fuel: [null],
      temp: [null],
      rfid: [null],
      overspeed: [""],
      enable: [null],
      sos_enable: [null],
      admin_number: [null, [Validators.required]],

    })
  }
  getdeviceMetaById() {
    this.deviceManageService.deviceMetaData(this.dealerId, this.customerId, this.deviceId).subscribe((res: any) => {
      this.getDeviceMata = res?.body?.Result?.Data;      
      this.advanceSettingForm = this.fb.group({
        simImei: [this.getDeviceMata?.SimImei, [Validators.required]],
        ignition: [this.getDeviceMata?.IgnitionEnable],
        ac: [this.getDeviceMata?.AcEnable == 0 ? null : this.getDeviceMata?.AcEnable],
        door: [this.getDeviceMata?.DoorEnable == 0 ? null : this.getDeviceMata?.DoorEnable],
        fuel: [this.getDeviceMata?.FuelEnable == 0 ? null : this.getDeviceMata?.FuelEnable],
        temp: [this.getDeviceMata?.TempEnable == 0 ? null : this.getDeviceMata?.TempEnable],
        rfid: [this.getDeviceMata?.RfidEnable ? this.getDeviceMata?.RfidEnable : 0],
        overspeed: [this.getDeviceMata?.OverSpeedLimit],
        enable: [this.getDeviceMata?.OdometerEnable ? this.getDeviceMata?.OdometerEnable : 0],
        sos_enable: [this.getDeviceMata?.SOSEnable ? this.getDeviceMata?.SOSEnable : 0],
        admin_number: [this.getDeviceMata?.AdminNumber, [Validators.required]],
      })

      this.getOdometerDetail(this.getDeviceMata)
    })
  }

  submit(formValue: any) {
    if (this.advanceSettingForm.invalid) {
      this.advanceSettingForm.markAllAsTouched();
      return;
    }
    let payload = {
      "Id": this.getDeviceMata?.Id,
      "ResellerId": Number(this.dealerId),
      "CustomerId": Number(this.customerId),
      "DeviceId": Number(this.deviceId),
      "SimImei": formValue?.simImei,
      "InstallerId": null,
      "SalesId": null,
      "IgnitionEnable": formValue?.ignition,
      "AcEnable": formValue?.ac,
      "DoorEnable": formValue?.door,
      "FuelEnable": formValue?.fuel,
      "TempEnable": formValue?.temp,
      "RfidEnable": formValue?.rfid,
      "SOSEnable": formValue?.sos_enable,
      "OdometerEnable": formValue?.enable,
      "OverSpeedLimit": Number(formValue?.overspeed),
      "AdminNumber": formValue?.admin_number
    }
    this.deviceManageService.updateDeviceMeta(payload, this.deviceId).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.advancedValue = res?.body?.Result?.Data
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.router.navigateByUrl('admin/device/device-manage')
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }

  cancel(event: any) {
    event.preventDefault()
    this.advanceSettingForm.reset()
    this.getdeviceMetaById()
  }

  getFilteredInputData(selectedItemId: number): any[] {
    return this.inputData.filter((item:any) => item.id !== selectedItemId);
  }

  filterOptions(selectedId: number, dropdownType: string) {
    if (dropdownType === 'ac') {
      this.doorFilteredData = this.inputData.filter(item => item.id !== selectedId);
    }else if(dropdownType === 'fuel'){
      this.tempFilterData = this.fueltData.filter(item => item.id !== selectedId);
    }else {
      this.acFilteredData = this.inputData.filter(item => item.id !== selectedId);
    }
  }

  getOdometerDetail(device:any){    
    this.selectedDevice = device?.DeviceId
    this.deviceManageService.getOdometer(device?.DeviceId).subscribe((res)=>{
      this.odometerData = res?.body?.Result?.Data
    })
  }

  addOdometer(selectedId:any){
    if(selectedId == 1){
      const initialState: ModalOptions = {
        initialState: { 
          selectedvalue: this.odometerData,
          deviceId: this.selectedDevice,
        },
      };
      this.bsModalRef = this.bsmodelService.show(
        FillOdometerComponent,
        Object.assign(initialState, { class: "modal-sm modal-dialog-centered alert-popup" })
      );
    }
  }
}
