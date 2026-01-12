import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { DeviceMakerService } from '../../../service/device-maker.service';

@Component({
  selector: 'app-add-device-type',
  templateUrl: './add-device-type.component.html',
  styleUrls: ['./add-device-type.component.scss']
})
export class AddDeviceTypeComponent {
  deviceTypeForm!: FormGroup;
  deviceTypeId: any;
  deviceMakerData: any
  deviceTypeData: any
  spinnerLoading: boolean = false
  routePath: any = 'admin/device/device-type'
  makerData = [{ id: 1, staus: 'True' }, { id: 0, staus: 'False' }]
  button: any = 'Submit';
  tittle:any = 'Add'

  constructor(
    private fb: FormBuilder,
    private deviceMakerService: DeviceMakerService,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.deviceTypeId = params.get('id');
      if (this.deviceTypeId) {
        this.tittle = 'Update'
        this.getDeviceTypeListById()
      }
    });
  }

  ngOnInit() {
    this.deviceTypeId = this.activeRoute.snapshot.paramMap.get("id")
    if (this.deviceTypeId) {
      this.getDeviceTypeListById()
    }
    this.setInitialValue();
    this.getDeviceMakerDropDown()

  }




  setInitialValue() {
    this.deviceTypeForm = this.fb.group({
      deviceMaker: [null, [Validators.required]],
      name: ['', [Validators.required,Validators.pattern(/^[^-]*$/)]],
      ipaddress: ['', [Validators.required]],
      portNo: ['', [Validators.required]],
      gpsWalk: [1, [Validators.required]],
      bleSupport: [null, [Validators.required]],
    })
  }

  getDeviceMakerDropDown() {
    this.spinnerLoading = true
    let payload = {
      "child_id": "0"
    }

    this.deviceMakerService.DeviceMakerList(payload).subscribe((res: any) => {
      this.spinnerLoading = false
      if (res?.status == 200) {
        this.deviceTypeData = res?.body?.data
      }
    })
  }

  submit(formvalue: any) {
    if (this.deviceTypeForm.invalid) {
      this.deviceTypeForm.markAllAsTouched();
      return;
    }
    let payload = {
      "id": 0,
      "name": formvalue?.name,
      "server_ip": formvalue?.ipaddress,
      "server_port": parseInt(formvalue?.portNo),
      "gps_walk": parseInt(formvalue?.gpsWalk),
      "ble_support": parseInt(formvalue?.bleSupport),
      "parent_id": parseInt(formvalue?.deviceMaker)
    }


    if (this.deviceTypeId) {
      payload['id'] = parseInt(this.deviceTypeId);
    }

    this.deviceMakerService.addDeviceType(payload).subscribe((res: any) => {
      this.deviceMakerData = res?.body?.Result;
      if (res?.body?.message == "success") {
        this.notificationService.showSuccess(res?.body?.result);
        this.router.navigateByUrl('admin/device/device-type');
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.body?.message)
      }
    })
  }

  getDeviceTypeListById() {
    this.button = 'Update'
    this.spinnerLoading = true
    let payload = {
      "child_id": this.deviceTypeId
    }

    this.deviceMakerService.DeviceTypeList(payload).subscribe((res: any) => {
      this.spinnerLoading = false
      if (res?.status == 200) {
        this.deviceMakerData = res?.body?.data[0]
        this.deviceTypeForm = this.fb.group({
          deviceMaker: [this.deviceMakerData?.parent_id, [Validators.required]],
          name: [this.deviceMakerData?.name, [Validators.required,Validators.pattern(/^[^-]*$/)]],
          ipaddress: [this.deviceMakerData?.server_ip, [Validators.required]],
          portNo: [this.deviceMakerData?.server_port, [Validators.required]],
          gpsWalk: [this.deviceMakerData?.gps_walk, [Validators.required]],
          bleSupport: [this.deviceMakerData?.ble_support, [Validators.required]],
        })
        
      }      
    })
  }

  cancel(event: any) {
    event.preventDefault()
    this.deviceTypeForm.reset()
    this.getDeviceTypeListById()
  }
}
