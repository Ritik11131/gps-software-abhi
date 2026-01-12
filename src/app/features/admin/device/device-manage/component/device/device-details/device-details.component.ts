import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { CustomerManageService } from 'src/app/features/admin/customer/customer-manage/serices/customer-manage.service';
import { DeviceManageService } from '../../../service/device-manage.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { DeviceCheckComponent } from '../device-check/device-check.component';
@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent {

  deviceData: any;
  vehiclTypeData: any;
  operatorData: any;
  deviceForm: FormGroup | any
  dealerId: any;
  customerId: any;
  deviceValue: any;
  deviceId: any;
  selectedDeviceData: any;
  selectedDealer: any;
  selectedCustomer: any;
  device: any
  routePath: any = 'admin/device/device-manage'
  type: any
  duplicateDevice: any;
  deviceMakerType: any;
  selectedMarkerId: any;
  devicemakerList: any;
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
  deivceLable : string = 'Add'
  constructor(
    private customerService: CustomerManageService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private deviceManageService: DeviceManageService,
    private refreshCustomerService: RefreshCustomerService,
    private router: Router,
    private bsmodalService: BsModalService,
    private modalService: BsModalService,
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('CustomerId');
      this.deviceId = params.get('deviceId')

      if (this.deviceId) {
        this.getDeviceData()
      }
    });
  }

  ngOnInit() {
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("CustomerId");
    this.deviceId = this.activeRoute.snapshot.paramMap.get('deviceId');
    if (this.deviceId) {
      this.getDeviceData()
    }
    if (this.selectedDealer) {
      this.dealerId = this.selectedDealer;
      this.customerId = this.selectedCustomer;
      this.deviceId = this.device;
      this.getDeviceData()
    }

    // this.getDeviceData()
    this.setInitialValue()
    this.getDeviceMarkerList();
    this.getVehicleType();
    this.getOperator();
    // this.getdevicemaker()
    this.getDevicetype()
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

  getDeviceMarkerList() {
    this.customerService.deviceType().subscribe((res: any) => {
      this.deviceData = res?.body?.Result?.add
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
      this.deviceForm.controls['simopr'].setValue(this.operatorData[0].Id)
    })
  }

  getDevicetype() {
    this.deviceManageService.devicetype().subscribe((res: any) => {
      this.deviceType = res?.body?.Result?.add;
    });
  }

  getDeviceMakerTypeById(id: any) {
    this.deviceManageService.devicetypeById(id).subscribe((res: any) => {
      this.deviceTypeData = res?.body?.Result?.add[0].formatted_DeviceName;
      const selectedDevice = this.deviceType.find((device: { formatted_DeviceName: any; }) => device.formatted_DeviceName === this.deviceTypeData);
      this.deviceForm.get('deviceMarkerType').setValue(selectedDevice?.formatted_DeviceId);
    });
  }


  getDeviceData() {
    this.deivceLable = 'Update';
    this.deviceManageService.deviceById(this.dealerId, this.customerId, this.deviceId).subscribe((res: any) => {
      this.selectedDeviceData = res?.body?.Result?.Data
      this.selectedColor = this.selectedDeviceData?.VehicleType?.Id
      this.DevicemakerTypeId = this.selectedDeviceData?.DeviceType?.Id
      this.deviceMakerId = this.selectedDeviceData?.DeviceType?.parent_id
      this.getDeviceMakerTypeById(this.selectedDeviceData?.DeviceType?.Id)
      this.deviceForm = this.fb.group({
        installationDate: [new Date(this.selectedDeviceData?.InstallationOn), [Validators.required]],
        deviceMarkerType: [null, [Validators.required]],
        deviceId: [this.selectedDeviceData?.DeviceId, [Validators.required]],
        deviceuid: [this.selectedDeviceData?.DeviceUid],
        description: [this.selectedDeviceData?.Description],
        simopr: [this.selectedDeviceData?.SimOperator?.Id, [Validators.required]],
        phn: [this.selectedDeviceData?.SimPhoneNumber, [Validators.required, Validators.pattern('^[0-9]{10}$|^[0-9]{13}$')]],
        vehicle: [this.selectedDeviceData?.VehicleNo, [Validators.required,
        ]],
        vehicletype: [this.selectedDeviceData?.VehicleType?.Id, [Validators.required]],
      })
      if (this.deviceForm.get('deviceId')) {
        this.deviceForm.get('deviceId').valueChanges.subscribe((value: any) => {
          this.getDeviceId(value)
        });
      }
    })
  }


  checkaplpha(value: string): boolean {
    const alphanumericRegex = /^[a-zA-Z0-9 ]*$/;
    return !alphanumericRegex.test(value); 
  }



  setInitialValue() {
    this.deviceForm = this.fb.group({
      installationDate: [new Date(), [Validators.required]],
      deviceMarkerType: [null, [Validators.required]],
      deviceId: ["", [Validators.required]],
      deviceuid: [""],
      description: [""],
      simopr: [null, [Validators.required]],
      phn: ["", [Validators.required, Validators.pattern('^[0-9]{10}$|^[0-9]{13}$')]],
      vehicle: ["", [Validators.required]],
      vehicletype: [null, [Validators.required]],

    })
    if (this.deviceForm.get('deviceId')) {
      this.deviceForm.get('deviceId').valueChanges.subscribe((value: any) => {
        this.getDeviceId(value)
      });
    }
  }

  getDeviceId(serachvalue: any) {
    if(this.selectedDeviceData?.DeviceId == serachvalue){
      this.duplicateDevice = false;
      return;
    }
    this.customerService.duplicateDevice(serachvalue).subscribe((res: any) => {
      this.duplicateDevice = res?.body?.Result.Data;
    })
  }

  onSelectedDevice(event: any) {
    const value = event.split('-')
    this.DevicemakerTypeId = value[0]
    this.deviceMakerId = value[1]
  }


  submit(formvalue: any) {
    if (this.deviceForm.invalid || this.duplicateDevice == true) {
      this.deviceForm.markAllAsTouched();
      return;
    }
    let payload = {
      "Id": 0,
      "CustomerId": this.customerId,
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
      "ResellerId": this.dealerId
    }
    let service = this.customerService.device(payload)

    if (this.deviceId) {
      payload['Id'] = this.selectedDeviceData?.Id;
      service = this.customerService.updateDevice(payload, this.deviceId)
    }

    service.subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.deviceValue = res?.body?.Result?.Data
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        if (this.type == 'Admin') {
          this.router.navigateByUrl('admin/dashboard')
        } else {
          this.router.navigateByUrl('admin/device/device-manage')
        }
        this.refreshCustomerService.announceCustomerAdded();
        this.bsmodalService.hide()
      } else {
        this.notificationService.showError(res?.error?.Error?.Message[0].ErrorMessage)
      }
    })
  }
  cancel(event: any) {
    this.bsmodalService.hide()
    event.preventDefault()
    this.deviceForm.reset()
    this.getDeviceData()
  }

  close() {
    this.bsmodalService.hide()
  }
  modalRef!: BsModalRef;
  openDeviceCheck() {

    this.modalRef = this.modalService.show(
      DeviceCheckComponent,
      Object.assign({
        id: "side-nav-confirmation",
        class: "modal-lg modal-dialog-centered",
      })
    );
  }
}
