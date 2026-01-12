import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceManageService } from '../../../service/device-manage.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';

@Component({
  selector: 'app-create-fitment',
  templateUrl: './create-fitment.component.html',
  styleUrls: ['./create-fitment.component.scss']
})
export class CreateFitmentComponent {
  invoiceFormGroup: any;
  fitmentForm: any
  dealerId: any;
  customerId: any;
  deviceId: any;
  resellerData: any;
  fitmentValue: any;
  isLinear = false
  routePath: any = 'admin/device/device-manage'
  selectedFile: File | null = null;
  vehicleImageData: any;
  deviceImageData:any
  fitmentImageData: any;

  constructor(private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private deviceManageService: DeviceManageService,
    private notificationService: NotificationService,
    private refreshCustomerService: RefreshCustomerService,
    private router: Router,
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('CustomerId');
      this.deviceId = params.get('deviceId')
      this.getResellerData()
    });
  }

  ngOnInit() {
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("CustomerId");
    this.deviceId = this.activeRoute.snapshot.paramMap.get('deviceId');
    this.createFitmentForm()
    this.getResellerData()
  }

  createFitmentForm(): void {
    this.fitmentForm = this.fb.group({
      invoiceFormGroup: this.fb.group({
        invoiceDate: [new Date(), Validators.required],
        invoiceNo: ['', Validators.required],
      }),
      ownerFormGroup: this.fb.group({
        ownerName: ['', Validators.required],
        address: ['', Validators.required],
        mobileNo: ['', Validators.required],
      }),
      rtoFormGroup: this.fb.group({
        state: ['', Validators.required],
        rto: ['', Validators.required],
        callibrationDate: [new Date(), Validators.required],
        callibrationValid: [new Date(), Validators.required],
      }),
      vehiclesFormGroup: this.fb.group({
        mfgyear: ['', Validators.required],
        vehicleNo: ['', Validators.required],
        vehicleMake: ['', Validators.required],
        vehicleModel: ['', Validators.required],
        engineNo: ['', Validators.required],
        chassisNo: ['', Validators.required],
        vehicleType: ['', Validators.required],
        noOfSos: ['', Validators.required],
        fitnessDate: [new Date(), Validators.required],
      }),
      deviceFormGroup: this.fb.group({
        deviceImei: ['', Validators.required],
        fitmentDate: [new Date(), Validators.required],
        type: ['', Validators.required],
        simNumber: ['', Validators.required],
        model: ['', Validators.required],
        uid: ['', Validators.required],
        iccid: ['', Validators.required],
      }),
      imageFormGroup: this.fb.group({
        vehicleImage: ['', Validators.required],
        deviceImage: ['', Validators.required],
        fitmentImage: ['', Validators.required],
      })
    });
  }

  saveForm(formValue: any) {
    let payload = {
      "FitmentRoot": {
        "Id": 0,
        "DeviceSno": Number(this.deviceId)
      },
      "FitmentRto": {
        "State": formValue?.rtoFormGroup?.state,
        "Rto": formValue?.rtoFormGroup?.rto,
        "CalibrationOn": formatDate(formValue?.rtoFormGroup?.callibrationDate, 'yyyy-MM-ddThh:mm:ss', 'en-US'),
        "CalibrationTill": formatDate(formValue?.rtoFormGroup?.callibrationValid, 'yyyy-MM-ddThh:mm:ss', 'en-US'),
        "RegistrationOn": formatDate(formValue?.rtoFormGroup?.callibrationDate, 'yyyy-MM-ddThh:mm:ss', 'en-US')
      },
      "FitmentDealer": {
        "Name": this.resellerData?.Name,
        "Address": this.resellerData?.Address
      },
      "FitmentVehicleDetails": {
        "MafYear": formValue?.vehiclesFormGroup?.mfgyear,
        "VehicleNo": formValue?.vehiclesFormGroup?.vehicleNo,
        "VehicleMake": formValue?.vehiclesFormGroup?.vehicleMake,
        "EngineNo": formValue?.vehiclesFormGroup?.engineNo,
        "ChasisNo": formValue?.vehiclesFormGroup?.chassisNo,
        "VehicleType": formValue?.vehiclesFormGroup?.vehicleType,
        "VehicleSubType": formValue?.vehiclesFormGroup?.noOfSos,
        "VehicleModel": formValue?.vehiclesFormGroup?.vehicleModel,
        "FitnessDate": formatDate(formValue?.vehiclesFormGroup?.fitnessDate, 'yyyy-MM-ddThh:mm:ss', 'en-US')
      },
      "FitmentDeviceDetails": {
        "IMEI": formValue?.deviceFormGroup?.deviceImei,
        "FitmentDate": formatDate(formValue?.deviceFormGroup?.fitmentDate, 'yyyy-MM-ddThh:mm:ss', 'en-US'),
        "DeviceType": formValue?.deviceFormGroup?.type,
        "SimPhoneNumber": formValue?.deviceFormGroup?.simNumber,
        "Model": formValue?.deviceFormGroup?.model,
        "UID": formValue?.deviceFormGroup?.uid,
        "ICCID": formValue?.deviceFormGroup?.iccid
      },
      "FitmentImage": {
        "VehicleImage": this.vehicleImageData,
        "DeviceImage": this.deviceImageData,
        "FitmentImage": this.fitmentImageData
      },
      "FitmentInvoice": {
        "InvoiceNumber": formValue?.invoiceFormGroup?.invoiceNo,
        "InvoiceDate": formatDate(formValue?.invoiceFormGroup?.invoiceDate, 'yyyy-MM-ddThh:mm:ss', 'en-US')
      },
      "FitmentOwner": {
        "Name": formValue?.ownerFormGroup?.ownerName,
        "Address": formValue?.ownerFormGroup?.address,
        "MobileNumber": formValue?.ownerFormGroup?.mobileNo
      }

    }
    this.deviceManageService.createFitment(payload).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.fitmentValue = res?.body?.Result?.Data
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.router.navigateByUrl('admin/device/device-manage')
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }

  getResellerData() {
    this.deviceManageService.getResselerById(this.dealerId).subscribe((res: any) => {
      this.resellerData = res?.body?.Result?.Data;
    });
  }

  upLoadImage(event: Event, fileType: any){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('Image', this.selectedFile);
      formData.append('FileFor', fileType);

      this.deviceManageService.fitmentPageImage(formData).subscribe((res: any) => {
        const fileName = res?.body?.Result?.Data?.FileName;
        if (fileType === 'VehicleImage') {
          this.vehicleImageData = fileName;
        } else if (fileType === 'DeviceImage') {
          this.deviceImageData = fileName;          
        }else if (fileType === 'FitmentImage') {
          this.fitmentImageData = fileName;          
        }
      });
    }
  }
  }

