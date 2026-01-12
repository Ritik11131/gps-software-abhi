import { Component } from '@angular/core';
import { DeviceManageService } from '../../../service/device-manage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-device-check',
  templateUrl: './device-check.component.html',
  styleUrls: ['./device-check.component.scss'],
})
export class DeviceCheckComponent {
  devicemakerList: any;
  makerType: any;
  makerTypes: boolean = false;
  ishours: boolean = false;
  hours = [
    {
      id: '24 Hour',
      label: '24 Hours'
    },
    {
      id: '48 Hour',
      label: '48 Hours'
    },
    {
      id: '72 Hour',
      label: '72 Hours'
    },
    {
      id: '1 Month',
      label: '1 Month'
    },
    {
      id: '2 Month',
      label: '2 Month'
    },
    {
      id: '6 Month',
      label: '6 Month'
    }
  ];
  selectedDevice: any;
  timeform!: FormGroup
  devicevalidity: any;
  maxCounts: any;
  constructor(
    private deviceManageService: DeviceManageService,
    private fb: FormBuilder,
    private bsModalService: BsModalService
  ) { }
  ngOnInit() {
    this.setInitialvalue()
    this.getdevicemaker();
  }

  setInitialvalue() {
    this.timeform = this.fb.group({
      maker: [null, [Validators.required]],
      device: [null, [Validators.required]],
      plan: [null, [Validators.required]]

    })
  }
  getdevicemaker() {
    this.deviceManageService.devicemaker().subscribe((res: any) => {
      this.devicemakerList = res?.body?.Result?.add;
    });
  }
  getdevicemakertype(id: any) {
    this.timeform.controls['device'].setValue(null);
    this.timeform.controls['plan'].setValue(null)

    this.deviceManageService.devicemakertype(id).subscribe((res: any) => {
      this.makerType = res?.body?.Result?.add;
      if (this.makerType.length == 0) {
        this.makerTypes = true;
        this.ishours = false
      } else {
        this.makerTypes = false;
        this.ishours = true
      }
    });
  }

  onSelectDevice(event: any) {
    this.timeform.controls['plan'].setValue(null);
    this.devicevalidity = null;
    this.selectedDevice = event;
  }

  onChangeDeviceTime(event: any) {
    this.devicevalidity = null;
    let timeFormat = event.split(' ');
    let hourMinutes: any;
    if (timeFormat[1] == "Hour") {
      hourMinutes = this.convertHoursToMinutes(timeFormat[0])
    } else {
      hourMinutes = this.convertMonthsToMinutes(timeFormat[0])
    }

    this.getDeviceTimeValidity(hourMinutes);

  }

  convertHoursToMinutes(hours: number): number {
    return hours * 60;
  }

  convertMonthsToMinutes(months: number): number {
    const daysInMonth = 30;
    const minutesInDay = 24 * 60;
    return months * daysInMonth * minutesInDay;
  }

  getDeviceTimeValidity(min: any) {
    this.deviceManageService.deviceTimeValidity(min, this.timeform.value.device).subscribe((res: any) => {

      this.devicevalidity = res?.body?.Result?.add;
      const countsArray = this.devicevalidity.map((data: any) => data.counts);
      this.maxCounts = Math.max(...countsArray);
    })
  }


  cancel() {
    this.bsModalService.hide()
  }
}
