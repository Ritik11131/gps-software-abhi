import { Component, EventEmitter, Output } from '@angular/core';
import { ManagementService } from '../../services/management.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss']
})
export class EditDeviceComponent {
  @Output() mapdata = new EventEmitter()
  bulk = [
    {
      id: 1,
      title: 'Car',
      icon: 'assets/images/vehicle-icon/car_icon.png'
    },
    {
      id: 2,
      title: 'Bus',
      icon: 'assets/images/vehicle-icon/bus_icon.png'
    },
    {
      id: 3,
      title: 'Truck',
      icon: 'assets/images/vehicle-icon/truck_icon.png'
    },
    {
      id: 4,
      title: 'Bike',
      icon: 'assets/images/vehicle-icon/scoty_icon.png'
    },
    {
      id: 5,
      title: 'JCB',
      icon: 'assets/images/vehicle-icon/jcb_icon (2).png'
    },
    {
      id: 6,
      title: 'Lifter',
      icon: 'assets/images/vehicle-icon/lifter_icon.png'
    },
    {
      id: 7,
      title: 'Loader',
      icon: 'assets/images/vehicle-icon/loader_icon.png'
    },
    {
      id: 8,
      title: 'Marker',
      icon: 'assets/images/vehicle-icon/marker_icon.png'
    },
    {
      id: 9,
      title: 'Person',
      icon: 'assets/images/vehicle-icon/person_icon.png'
    },
    {
      id: 10,
      title: 'Pet',
      icon: 'assets/images/vehicle-icon/pet_icon.png'
    },
    {
      id: 11,
      title: 'Ship',
      icon: 'assets/images/vehicle-icon/ship_icon.png'
    },
    {
      id: 12,
      title: 'Tanker',
      icon: 'assets/images/vehicle-icon/tanker_icon.png'
    },
    {
      id: 13,
      title: 'Taxi',
      icon: 'assets/images/vehicle-icon/taxi_icon.png'
    },
    {
      id: 14,
      title: 'Tractor',
      icon: 'assets/images/vehicle-icon/tractor_icon.png'
    },
  ];
  data: any;
  vehicleNo: any;
  speedLimit: any;
  vehicleType: any | null
  selectedVehicle: any;
  id: any;
  selectedColor: any;

  constructor(
    private deviceService: ManagementService,
    private notificationService: NotificationService,
    private modalService : BsModalService
  ) { }

  ngOnInit() {
    this.vehicleNo = this.data?.Device?.VehicleNo;
    this.speedLimit = this.data?.Peripherial?.OverSpeedLimit;
    this.id = this.data?.Device?.Id

    let newVehicleData = this.bulk?.filter((ele: any) => ele?.id == this.data?.Device?.VehicleType);
    newVehicleData?.forEach((data: any) => {
      this.vehicleType = data?.title;
      this.selectedVehicle = data?.id;
      this.selectedColor = data?.id;
    });
  }

  onVehicleChange() {
    this.selectedColor = this.selectedVehicle;
  }

  imageId(id: any) {
    this.selectedColor = id;
    this.selectedVehicle = id;
  }

  selectedVehicleColor(event:any){
    this.selectedColor = event;
  }

  submit() {
    if(!this.vehicleNo || !this.speedLimit || !this.selectedVehicle) {
      return
    }
    this.updateVehicleDeviceData();
  }

  updateVehicleDeviceData() {
    let payload = {
      "VehicleNo": this.vehicleNo,
      "VehicleType": {
        "Id": this.selectedVehicle,
        "Name": ""
      }
    }

    this.deviceService.updateVehcleType(payload, this.id).subscribe((res: any) => {
      if(res?.body?.ResponseMessage == 'Success') {
        this.updateOverLimit();
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
    })

  }

  updateOverLimit() {
    let payload = {
      "OverSpeedLimit": this.speedLimit
  }
    this.deviceService.updateOverSpeed(payload,this.id).subscribe((res:any) => {
      if(res?.body?.ResponseMessage == 'Success') {
        this.updateOdo();
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
    })
  }

  updateOdo() {
    let payload = {      
        "Id": this.id,
        "Odometer": 0    
    }    
    this.deviceService.updateOdometer(payload,this.id).subscribe((res:any) => {
      if(res?.body?.ResponseMessage == 'Success') {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        setTimeout(() => {
          this.modalService.hide();
        }, 2000)
        this.mapdata.emit('')
      } else {
        this.notificationService.showError(res?.error?.Error?.Data)
      }
    })
  }

  cancel() {
    this.modalService.hide();
    this.mapdata.emit('')
  }

}
