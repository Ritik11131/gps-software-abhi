import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { DeviceManageService } from '../../../service/device-manage.service';
import { DeviceMakerService } from '../../../service/device-maker.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-add-device-maker',
  templateUrl: './add-device-maker.component.html',
  styleUrls: ['./add-device-maker.component.scss']
})
export class AddDeviceMakerComponent {
  deviceMakerForm!: FormGroup;
  deviceMakerId: any;
  deviceMakerData: any
  spinnerLoading: boolean = false
  routePath: any = 'admin/device/device-maker'
  makerData = [{ id: 1, staus: 'True' }, { id: 0, staus: 'False' }]
  button: any = 'Submit';
  label : any = 'Add'

  constructor(
    private fb: FormBuilder,
    private deviceMakerService: DeviceMakerService,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.deviceMakerId = params.get('id');
      if (this.deviceMakerId) {
        this.getDeviceMarkerListById()

      }
    });
  }

  ngOnInit() {
    this.deviceMakerId = this.activeRoute.snapshot.paramMap.get("id")
    if (this.deviceMakerId) {
      this.getDeviceMarkerListById()
    }
    this.setInitialValue();
  }




  setInitialValue() {
    this.deviceMakerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[^-]*$/)]],
      ipaddress: ['', [Validators.required]],
      portNo: ['', [Validators.required]],
      gpsWalk: [null, [Validators.required]],
      bleSupport: [null, [Validators.required]],
    })
  }

  submit(formvalue: any) {
    if (this.deviceMakerForm.invalid) {
      this.deviceMakerForm.markAllAsTouched();
      return;
    }
    let payload = {
      "id": 0,
      "name": formvalue?.name,
      "server_ip": formvalue?.ipaddress,
      "server_port": parseInt(formvalue?.portNo),
      "gps_walk": parseInt(formvalue?.gpsWalk),
      "ble_support": parseInt(formvalue?.bleSupport),
      "parent_id": 0
    }
    if (this.deviceMakerId) {
      payload['id'] = parseInt(this.deviceMakerId);
    }

    this.deviceMakerService.addDeviceMaker(payload).subscribe((res: any) => {
      this.deviceMakerData = res?.body?.Result;
      if (res?.body?.message == "success") {
        this.notificationService.showSuccess(res?.body?.result);
        this.router.navigateByUrl('admin/device/device-maker');
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.body?.message)
      }
    })
  }

  getDeviceMarkerListById() {
    this.label = 'Update'
    this.spinnerLoading = true
    let payload = {
      "child_id": this.deviceMakerId
    }

    this.deviceMakerService.DeviceMakerList(payload).subscribe((res: any) => {
      this.spinnerLoading = false
      if (res?.status == 200) {
        this.deviceMakerData = res?.body?.data[0]
        this.deviceMakerForm = this.fb.group({
          name: [this.deviceMakerData?.name, [Validators.required, Validators.pattern(/^[^-]*$/)]],
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
    this.deviceMakerForm.reset()
    this.getDeviceMarkerListById()
  }
}
