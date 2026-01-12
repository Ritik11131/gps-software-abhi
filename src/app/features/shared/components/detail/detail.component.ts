import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CustomerManageService } from 'src/app/features/admin/customer/customer-manage/serices/customer-manage.service';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
import { RefreshCustomerService } from '../../services/refresh-customer.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  @Input() deviceValue :any
  @Output() closePopup = new EventEmitter();
  deviceData: any;
  vehiclTypeData: any;
  deviceForm!: FormGroup | any
  operatorData:any = [{
    name:'test'
  }]
  selectedDeviceData: any;
  deviceMakerType: any;
  devicemakerList: any;
  duplicateDevice: any;
  selectedMarkerId: any;
  deviceType: any;
  DevicemakerTypeId: any;
  deviceMakerId: any;
  deviceTypeData: any;
  iconList = [
    { id: 1, icon: 'assets/images/vehicle-icon/car_icon.png' },
    { id: 2, icon: 'assets/images/vehicle-icon/bus_icon.png' },
    { id: 3, icon: 'assets/images/vehicle-icon/truck_icon.png' },
    { id: 4, icon: 'assets/images/vehicle-icon/scoty_icon.png' },
    { id: 5, icon: 'assets/images/vehicle-icon/jcb_icon (2).png' },
    { id: 6, icon: 'assets/images/vehicle-icon/lifter_icon.png' },
    { id: 7, icon: 'assets/images/vehicle-icon/loader_icon.png' },
    { id: 8, icon: 'assets/images/vehicle-icon/marker_icon.png' },
    { id: 9, icon: 'assets/images/vehicle-icon/person_icon.png' },
    { id: 10, icon: 'assets/images/vehicle-icon/pet_icon.png' },
    { id: 11, icon: 'assets/images/vehicle-icon/ship_icon.png' },
    { id: 12, icon: 'assets/images/vehicle-icon/tanker_icon.png' },
    { id: 13, icon: 'assets/images/vehicle-icon/taxi_icon.png' },
    { id: 14, icon: 'assets/images/vehicle-icon/tractor_icon.png' },
  ]
  selectedColor: any;
constructor( 
  private fb: FormBuilder,
  private customerService: CustomerManageService,
  private deviceManageService: DeviceManageService,
  private notificationService: NotificationService,
  private refreshCustomerService: RefreshCustomerService,
){}

ngOnInit(){  
  this.setInitialValue()
  this.getDeviceList()
  this.getVehicleType()
  this.getOperator()
  this.getdevicemaker()
  if(this.deviceValue){
this.getDeviceData()
this.getDevicetype()
  }
}

setInitialValue() {
  this.deviceForm = this.fb.group({
    installationDate: [new Date(), [Validators.required]],
    deviceMaker: [null, [Validators.required]],
    deviceMarkerType: [null, [Validators.required]],
    deviceId: ["", [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    deviceImei: ["", [Validators.required]],
    deviceuid: [""],
    description: [""],
    simopr: [null, [Validators.required]],
    phn: ["", [Validators.required, Validators.pattern('^[0-9](\\d{9}|\\d{12})$')]],
    vehicle: [this.selectedDeviceData?.VehicleNo, [  Validators.required,
      Validators.pattern('^[a-zA-Z0-9 ]*$'),
      Validators.maxLength(20)]],
    vehicletype: [null, [Validators.required]],

  })

}

// phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
//   const phoneNumber = control.value;
//   if (!phoneNumber) {
//     return null;
//   }
//   return phoneNumber.length === 13 ? null : { invalidPhoneNumber: true };
// }

// imeiNumberValidator(control: AbstractControl): ValidationErrors | null {
//   const imeiNumber = control.value;
//   if (!imeiNumber) {
//     return null;
//   }
//   return imeiNumber.length === 15 ? null : { invalidImeiNumber: true };
// }

getDevicetype() {
  this.deviceManageService.devicetype().subscribe((res: any) => {
    this.deviceType = res?.body?.Result?.add;
  });
}

imageId(id: any) {
  this.selectedColor = id
  const selectedVehicleType = this.vehiclTypeData.find((item: any) => item.Id == id);
  if (selectedVehicleType) {
    this.deviceForm.patchValue({ vehicletype: selectedVehicleType.Id });
  }
}

  
selectedVehicle(event:any){
  this.selectedColor = event
}

getDeviceMakerTypeById(id:any){
  this.deviceManageService.devicetypeById(id).subscribe((res: any) => {
    this.deviceTypeData = res?.body?.Result?.add[0].formatted_DeviceName;
    const selectedDevice = this.deviceType.find((device: { formatted_DeviceName: any; }) => device.formatted_DeviceName === this.deviceTypeData);
    this.deviceForm.get('deviceMarkerType').setValue(selectedDevice?.formatted_DeviceId);

  });
}
onSelectedDevice(event: any) {
  const value = event.split('-')
  this.DevicemakerTypeId = value[0]
  this.deviceMakerId = value[1]
}

onSelectMarker(event: any) {
  this.selectedMarkerId = event
  this.getdevicemakertype(this.selectedMarkerId)
  this.deviceForm.controls['deviceMarkerType'].setValue(null)
}

getDeviceList() {
  this.customerService.deviceType().subscribe((res: any) => {
    this.deviceData = res?.body?.Result?.Data
  })
}

getVehicleType() {
  this.customerService.vehicleType().subscribe((res: any) => {
    this.vehiclTypeData = res?.body?.Result?.Data
    this.deviceForm.controls['vehicletype'].setValue(this.vehiclTypeData[0].Id)
    this.selectedColor = this.vehiclTypeData[0].Id
  })
}

getOperator() {
  this.customerService.operator().subscribe((res: any) => {
    this.operatorData = res?.body?.Result?.Data
  })
}

getdevicemakertype(id: any) {
  this.deviceManageService.devicemakertype(id).subscribe((res: any) => {
    this.deviceMakerType = res?.body?.Result?.add;
  });
}

getdevicemaker() {
  this.deviceManageService.devicemaker().subscribe((res: any) => {
    this.devicemakerList = res?.body?.Result?.add;
  });
}

getDeviceId(serachvalue: any) {
  this.customerService.duplicateDevice(serachvalue).subscribe((res: any) => {
    this.duplicateDevice = res?.body?.Result.Data
  })
}

getDeviceData() {    
  this.deviceManageService.deviceById(this.deviceValue?.Dealer?.Id, this.deviceValue?.Customer?.Id, this.deviceValue?.Device?.Id).subscribe((res:any) => {
    this.selectedDeviceData = res?.body?.Result?.Data   
    this.selectedColor = this.selectedDeviceData?.VehicleType?.Id
    this.getdevicemakertype(this.selectedDeviceData?.DeviceType?.parent_id)
    this.getDeviceMakerTypeById(this.selectedDeviceData?.DeviceType?.Id)
    this.deviceForm = this.fb.group({
      installationDate: [new Date(this.selectedDeviceData?.InstallationOn), [Validators.required]],
      deviceMaker: [this.selectedDeviceData?.DeviceType?.parent_id, [Validators.required]],
      deviceMarkerType: [null, [Validators.required]],
      deviceId: [this.selectedDeviceData?.DeviceId, [Validators.required,Validators.pattern('^[0-9]{10,15}$')]],
      deviceImei: [this.selectedDeviceData?.DeviceImei, [Validators.required]],
      deviceuid: [this.selectedDeviceData?.DeviceUid],
      description: [this.selectedDeviceData?.Description],
      simopr: [this.selectedDeviceData?.SimOperator?.Id, [Validators.required]],
      phn: [this.selectedDeviceData?.SimPhoneNumber, [Validators.required,Validators.pattern('^[0-9](\\d{9}|\\d{12})$')]],
      vehicle: [this.selectedDeviceData?.VehicleNo, [Validators.required]],
      vehicletype: [this.selectedDeviceData?.VehicleType?.Id, [Validators.required]],

    })
  })
}

cancel(event:any) {
  this.closePopup.emit(false)
  event.preventDefault()
  this.deviceForm.reset()
  this.getDeviceData()
}

submit(formvalue: any) {
  if (this.deviceForm.invalid) {
    this.deviceForm.markAllAsTouched();
    return;
  }
  let payload = {
    "Id": 0,
    "CustomerId": this.deviceValue?.Customer?.Id,
    "DeviceType": {
      "Id": this.DevicemakerTypeId,
      "parent_id": this.deviceMakerId
    },
    "DeviceId": formvalue?.deviceId,
    "DeviceImei": formvalue?.deviceId,
    "VehicleNo": formvalue?.vehicle,
    "VehicleType": {
      "Id": formvalue?.vehicletype
    },
    "Description": formvalue?.description,
    "InstallationOn": formatDate(formvalue?.installationDate, 'yyyy-MM-dd', 'en-US'),
    "SimOperator": {
      "Id": formvalue?.simopr
    },
    "SimPhoneNumber": formvalue?.phn,
    "DeviceUid": formvalue?.deviceuid,
    "ResellerId": this.deviceValue?.Dealer?.Id
  }
  if(this.deviceValue){
    payload['Id'] = this.selectedDeviceData?.Id;
  }

  this.customerService.updateDevice(payload, this.deviceValue?.Device?.Id).subscribe((res:any) => {
    if(res?.body?.ResponseMessage == 'Success') {
      this.deviceValue = res?.body?.Result?.Data
      this.closePopup.emit(false)
      this.notificationService.showSuccess(res?.body?.Result?.Message);
      this.refreshCustomerService.announceCustomerAdded();
    } else {
      this.notificationService.showError(res?.error?.Error?.Message)
    }
  })
}
}
