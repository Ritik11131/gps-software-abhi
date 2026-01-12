import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerManageService } from 'src/app/features/admin/customer/customer-manage/serices/customer-manage.service';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent {
  @Input() userData: any
  @Output() closePopup = new EventEmitter();
  deviceData: any;
  vehiclTypeData: any;
  operatorData: any;
  deviceForm!: FormGroup
  deviceValue: any;
  duplicateDevice: any;
  deviceMakerType: any;
  selectedMarkerId: any;
  devicemakerList: any;
  deviceType: any;
  DevicemakerTypeId: any;
  deviceMakerId: any;
  deviceTypeData: any;
  selectedColor: any;
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

  constructor(
    private customerService: CustomerManageService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private deviceManageService: DeviceManageService,
  ) {
  }

  ngOnInit() {
    this.setInitialValue()
    this.getDeviceList();
    this.getVehicleType();
    this.getOperator();
    // this.getdevicemaker()
    this.getDevicetype()
  }

  getDeviceList() {
    this.customerService.deviceType().subscribe((res: any) => {
      this.deviceData = res?.body?.Result?.Data
    })
  }
  selectedVehicle(event:any){
    this.selectedColor = event
  }

  imageId(id: any) {
    this.selectedColor = id
    const selectedVehicleType = this.vehiclTypeData.find((item: any) => item.Id == id);
    if (selectedVehicleType) {
      this.deviceForm.patchValue({ vehicletype: selectedVehicleType.Id });
    }
  }
  
  checkaplpha(value: string): boolean {
    const alphanumericRegex = /^[a-zA-Z0-9 ]*$/;
    return !alphanumericRegex.test(value); 
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
      this.deviceForm.controls['simopr'].setValue(this.operatorData[0].Id)
    })
  }

  getDevicetype() {
    this.deviceManageService.devicetype().subscribe((res: any) => {
      this.deviceType = res?.body?.Result?.add;
    });
  }

  onSelectedDevice(event: any) {
    const value = event.split('-')
    this.DevicemakerTypeId = value[0]
    this.deviceMakerId = value[1]
  }

  setInitialValue() {
    this.deviceForm = this.fb.group({
      installationDate: [new Date(), [Validators.required]],
      deviceMaker: [null],
      deviceMarkerType: [null, [Validators.required]],
      deviceId: ["", [Validators.required,Validators.pattern('^[0-9]{10,15}$')]],
      deviceImei: [""],
      deviceuid: ["", [Validators.required]],
      description: ["", [Validators.required]],
      simopr: [null, [Validators.required]],
      phn: ["", [Validators.required, Validators.pattern('^[0-9](\\d{9}|\\d{12})$')]],
      vehicle: ["",[Validators.required]],
      vehicletype: [null, [Validators.required]],
    })

    if (this.deviceForm.get('deviceId')) {
      this.deviceForm.get('deviceId')!.valueChanges.subscribe(value => {         
          this.getDeviceId(value)
      });
  }
  }

  getDeviceId(serachvalue:any) {
    this.customerService.duplicateDevice(serachvalue).subscribe((res:any) => {
      this.duplicateDevice = res?.body?.Result.Data
    })
  }

  getdevicemaker() {
    this.deviceManageService.devicemaker().subscribe((res: any) => {
      this.devicemakerList = res?.body?.Result?.add;
    });
  }

  getdevicemakertype(id: any) {
    this.deviceManageService.devicemakertype(id).subscribe((res: any) => {
      this.deviceMakerType = res?.body?.Result?.add;
    });
  }

  onSelectMarker(event: any) {
    this.selectedMarkerId = event
    this.getdevicemakertype(this.selectedMarkerId)
    this.deviceForm.controls['deviceMarkerType'].setValue(null)
  }

  submit(formvalue: any) {
    if (this.deviceForm.invalid) {
      this.deviceForm.markAllAsTouched();
      return;
    }
    let payload = {
  "Id": 0,
      "CustomerId": this.userData?.Customer?.Id,
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
      "ResellerId": this.userData?.Dealer?.Id
    }
    this.customerService.device(payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.deviceValue = res?.body?.Result?.Data;
        this.closePopup.emit(false)
        this.notificationService.showSuccess(res?.body?.Result?.Message);
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }

  cancel(event: any) {
    this.closePopup.emit(false)
    event.preventDefault()
    this.deviceForm.reset()
  }

  selectFile(event:any): void {
    event.preventDefault();
    const fileInput = document.getElementById('excelFileInput');
    if (fileInput) {
      fileInput.click();
    } else {
      console.error('File input element not found');
    }
  }
  
  uploadExcel(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const data = fileReader.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      console.error('No file selected');
    }
  }
}
