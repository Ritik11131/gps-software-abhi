import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { DeviceCommandService } from '../../../service/device-command.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'app-add-device-command',
  templateUrl: './add-device-command.component.html',
  styleUrls: ['./add-device-command.component.scss']
})
export class AddDeviceCommandComponent {

  deviceCommandForm!: FormGroup;
  deviceMakerId: any;
  deviceMakerData: any
  spinnerLoading: boolean = false
  routePath: any = 'admin/device/device-command'
  button: any = 'Submit';
  deviceTypeData: any;
  commandTypeData: any;
  deiveCommandData: any;
  selectedDeviceType: any;
  selectedMaker: any;
  deviceCommandList: any;
  commandType: any;
  constructor(private fb: FormBuilder,
    private deviceCommandService: DeviceCommandService,
    private refreshCustomerService: RefreshCustomerService,
    private router:Router,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.setInitialValue()
    this.getMakerDropdown()
    this.getDeviceTypeDropdown()
    this.getcommandType()
  }

  setInitialValue() {
    this.deviceCommandForm = this.fb.group({
      deviceMaker: [null, [Validators.required]],
      deviceType: [null, [Validators.required]],
      commandType: [null, [Validators.required]],
      command: ['', [Validators.required]],
      hexa_code: ['', [Validators.required]],
    })
  }

  onMakerSelect(event: any) {
    this.button = 'Submit'
    this.selectedMaker = event
    this.deviceCommandForm.controls['deviceType'].setValue(null)
    this.deviceCommandForm.controls['commandType'].setValue(null)
    this.deviceCommandForm.controls['command'].setValue(null)
    this.deviceCommandForm.controls['hexa_code'].setValue(null)
    this.getDeviceTypeDropdown()
  }

  ondeviceTypeSelect(event: any) {
    this.button = 'Submit'
    this.selectedDeviceType = event
    this.deviceCommandForm.controls['commandType'].setValue(null)
    this.deviceCommandForm.controls['command'].setValue(null)
    this.deviceCommandForm.controls['hexa_code'].setValue(null)
  }

  onSelectCommand(event: any) {
    this.button = 'Submit'
    this.commandType = event
    if(this.commandType){
      this.getDeviceCommandList()
    }
    this.deviceCommandForm.controls['command'].setValue(null)
    this.deviceCommandForm.controls['hexa_code'].setValue(null)
  }

  getMakerDropdown() {
    let payload = {
      "deviceMakerId": 0
    }
    this.deviceCommandService.deviceMakerDropdown(payload).subscribe((res: any) => {
      this.deviceMakerData = res?.body?.data
    })
  }

  getDeviceTypeDropdown() {
    let payload = {
      "deviceTypeId": this.selectedMaker ? this.selectedMaker : 0
    }
    this.deviceCommandService.deviceDeviceTypeDropdown(payload).subscribe((res: any) => {
      this.deviceTypeData = res?.body?.data
    })
  }
  getcommandType() {
    this.deviceCommandService.commandTypeDropdown().subscribe((res: any) => {
      this.commandTypeData = res?.body?.data
    })
  }

  getDeviceCommandList() {
    let payload = {
      "device_maket_id": this.selectedMaker ? this.selectedMaker : 0,
      "device_type_id": this.selectedDeviceType ? this.selectedDeviceType : 0
    }
    this.deviceCommandService.deviceCommandList(payload).subscribe((res: any) => {
      if (res?.status == 200) {
        this.deviceCommandList = res?.body?.data
        this.button = this.deviceCommandList.length == 0 ? 'Submit' : 'Update';
        this.deviceCommandList?.forEach((val:any)=>{
          if(val?.fk_device_type == this.selectedDeviceType && val?.command_type == this.commandType){
            this.deviceCommandForm.controls['command'].setValue(val?.command_string)
            this.deviceCommandForm.controls['hexa_code'].setValue(val?.command_text)
          }
          
        })
      } 
    })
  }


  submit(formValue: any) {
    if (this.deviceCommandForm.invalid) {
      this.deviceCommandForm.markAllAsTouched();
      return;
    }
    let payload = {
      "device_type_id": Number(formValue?.deviceType),
      "command_type_id": Number(formValue?.commandType),
      "command_text": formValue?.hexa_code,
      "command_string":  formValue?.command
    }

    this.deviceCommandService.addUpdateCommand(payload).subscribe((res: any) => {      
      this.deiveCommandData = res?.body?.Result;
      if (res?.status == 200) {
        this.notificationService.showSuccess(res?.body?.message);
        this.router.navigateByUrl('admin/device/device-command');
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.body?.message)
      }
    })
  }

  cancel(event: any) {
    event.preventDefault()
    this.deviceCommandForm.reset()
  }
}
