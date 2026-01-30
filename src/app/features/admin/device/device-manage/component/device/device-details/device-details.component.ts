import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { CustomerManageService } from 'src/app/features/admin/customer/customer-manage/serices/customer-manage.service';
import { DeviceManageService } from '../../../service/device-manage.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { DeviceCheckComponent } from '../device-check/device-check.component';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnDestroy {

  deviceTypeData: any = []; // Device types from Masters/DeviceType
  vehiclTypeData: any = []; // Vehicle types from Masters/VehicleType
  operatorData: any = []; // Operators from Masters/OperatorType
  planData: any = []; // Plans (if needed)
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
  isUniqueIdDuplicate: boolean = false;
  isCheckingUniqueId: boolean = false;
  deviceMakerType: any;
  selectedMarkerId: any;
  devicemakerList: any;
  deviceType: any;
  DevicemakerTypeId: any;
  deviceMakerId: any;
  spinnerLoading: boolean = false;
  labelName: string = 'Add';
  buttonValue: string = 'Add';
  private destroy$ = new Subject<void>();
  private uniqueIdSubject = new Subject<string>();
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
    // Removed paramMap subscription from constructor to avoid duplicate API calls
    // The call will be made only in ngOnInit
  }

  ngOnInit() {
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("CustomerId");
    this.deviceId = this.activeRoute.snapshot.paramMap.get('deviceId');
    
    // If deviceId is not in params, check if we're in add mode
    if (!this.deviceId) {
      const url = this.router.url;
      // Check if URL contains 'add-device' without deviceId parameter
      if (url.includes('add-device') && !url.match(/\/\d+\/add-device$/)) {
        this.deviceId = null; // Add mode
      }
    }
    
    this.setInitialValue();
    this.setupUniqueIdDebounce();
    
    // Load master data
    this.getDeviceTypes();
    this.getVehicleTypes();
    this.getOperatorTypes();
    this.getPlans();
    
    // Load device data if editing (deviceId exists and is not 'add-device')
    if (this.deviceId && this.deviceId !== 'add-device' && this.deviceId !== 'null') {
      this.getDeviceData();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupUniqueIdDebounce() {
    this.uniqueIdSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((uniqueId: string) => {
      if (uniqueId && uniqueId.trim().length > 0) {
        this.validateUniqueId(uniqueId);
      } else {
        this.isUniqueIdDuplicate = false;
        this.isCheckingUniqueId = false;
      }
    });
  }

  onUniqueIdChange(uniqueId: string) {
    this.isCheckingUniqueId = true;
    this.uniqueIdSubject.next(uniqueId);
  }

  validateUniqueId(uniqueId: string) {
    const id = this.deviceId && this.deviceId !== 'add-device' ? parseInt(this.deviceId) : 0;
    this.deviceManageService.validateDeviceUniqueId(uniqueId, id).subscribe((res: any) => {
      this.isCheckingUniqueId = false;
      if (res?.status === 200) {
        if (res?.body?.result === true) {
          // data: false means unique ID is available (not duplicate)
          // data: true means unique ID is duplicate
          this.isUniqueIdDuplicate = res?.body?.data === true;
          if (this.isUniqueIdDuplicate) {
            this.deviceForm.get('deviceUid')?.setErrors({ duplicate: true });
          } else {
            const errors = this.deviceForm.get('deviceUid')?.errors;
            if (errors) {
              delete errors['duplicate'];
              if (Object.keys(errors).length === 0) {
                this.deviceForm.get('deviceUid')?.setErrors(null);
              } else {
                this.deviceForm.get('deviceUid')?.setErrors(errors);
              }
            }
          }
        } else if (res?.body?.result === false) {
          // Error response: {"result":false,"data":"Duplicate device unique id."}
          const errorMessage = res?.body?.data || '';
          if (errorMessage.toLowerCase().includes('duplicate')) {
            this.isUniqueIdDuplicate = true;
            this.deviceForm.get('deviceUid')?.setErrors({ duplicate: true });
          }
        }
      }
    }, (error: any) => {
      this.isCheckingUniqueId = false;
      // On error, assume it's valid to allow submission
      this.isUniqueIdDuplicate = false;
    });
  }

  imageId(id: any) {
    this.selectedColor = id
    const selectedVehicleType = this.vehiclTypeData.find((item: any) => item.id == id);
    if (selectedVehicleType) {
      this.deviceForm.patchValue({ fkVehicleType: selectedVehicleType.id });
    }
  }
  
  selectedVehicle(event:any){
    this.selectedColor = event
  }

  getDeviceTypes() {
    this.deviceManageService.getDeviceTypes().subscribe((res: any) => {
      if (res?.status === 200 && res?.body?.result === true) {
        this.deviceTypeData = res?.body?.data || [];
      }
    });
  }

  getVehicleTypes() {
    this.deviceManageService.getVehicleTypes().subscribe((res: any) => {
      if (res?.status === 200 && res?.body?.result === true) {
        this.vehiclTypeData = res?.body?.data || [];
      }
    });
  }

  getOperatorTypes() {
    this.deviceManageService.getOperatorTypes().subscribe((res: any) => {
      if (res?.status === 200 && res?.body?.result === true) {
        this.operatorData = res?.body?.data || [];
        // Auto-fill Primary SIM Operator with Airtel when adding a new device
        const isAddMode = !this.deviceId || this.deviceId === 'add-device' || this.deviceId === 'null';
        if (isAddMode && this.operatorData?.length > 0 && this.deviceForm) {
          const airtel = this.operatorData.find((op: any) =>
            (op?.name || '').toLowerCase().trim() === 'airtel'
          );
          if (airtel?.id != null) {
            this.deviceForm.patchValue({ fkSimOperator: airtel.id });
          }
        }
      }
    });
  }

  getPlans() {
    this.deviceManageService.getCustomerPlans().subscribe((res: any) => {
      if (res?.status === 200 && res?.body?.result === true) {
        this.planData = res?.body?.data || [];
      }
    });
  }

  // Commented out - using new API structure
  // getDeviceMakerTypeById(id: any) {
  //   this.deviceManageService.devicetypeById(id).subscribe((res: any) => {
  //     this.deviceTypeData = res?.body?.Result?.add[0].formatted_DeviceName;
  //     const selectedDevice = this.deviceType.find((device: { formatted_DeviceName: any; }) => device.formatted_DeviceName === this.deviceTypeData);
  //     this.deviceForm.get('deviceMarkerType').setValue(selectedDevice?.formatted_DeviceId);
  //   });
  // }


  getDeviceData() {
    this.buttonValue = 'Update';
    this.labelName = 'Update';
    this.spinnerLoading = true;
    this.deviceManageService.getDeviceById(this.deviceId).subscribe((res: any) => {
      this.spinnerLoading = false;
      if (res?.status === 200 && res?.body?.result === true) {
        const deviceData = res?.body?.data?.[0] || res?.body?.data; // API returns array or object
        this.selectedDeviceData = deviceData;
        
        this.deviceForm.patchValue({
          deviceUid: deviceData?.deviceUid || '',
          deviceImei: deviceData?.deviceImei || '',
          serialNumber: deviceData?.attribute?.batterySerialNo || '',
          fkDeviceType: deviceData?.fkDeviceType || null,
          fkVehicleType: deviceData?.fkVehicleType || null,
          simPhoneNumber: deviceData?.simPhoneNumber || '',
          fkSimOperator: deviceData?.fkSimOperator || null,
          simSecPhoneNumber: deviceData?.simSecPhoneNumber || '',
          fkSecSimOperator: deviceData?.fkSecSimOperator || null,
          vehicleNo: deviceData?.vehicleNo || '',
          installationOn: deviceData?.installationOn ? new Date(deviceData.installationOn) : new Date(),
          planType: deviceData?.plan?.id || null,
          description: deviceData?.description || ''
        });
      }
    });
  }


  checkaplpha(value: string): boolean {
    const alphanumericRegex = /^[a-zA-Z0-9 ]*$/;
    return !alphanumericRegex.test(value); 
  }



  setInitialValue() {
    this.deviceForm = this.fb.group({
      deviceUid: ['', [Validators.required]], // Unique ID - mandatory
      deviceImei: ['', []], // Device IMEI
      serialNumber: ['', []], // Serial number
      fkDeviceType: [null, [Validators.required]], // Device Type - mandatory
      fkVehicleType: [null, [Validators.required]], // Vehicle Type - mandatory
      simPhoneNumber: ['', [Validators.required]], // Primary SIM Number - mandatory
      fkSimOperator: [null, []], // Primary SIM Operator
      simSecPhoneNumber: ['', []], // Secondary SIM Number
      fkSecSimOperator: [null, []], // Secondary SIM Operator
      vehicleNo: ['', [Validators.required]], // Vehicle Number - mandatory
      installationOn: [new Date(), []], // Installation Date
      planType: [null, []], // Plan
      description: ['', []] // Description
    });

    // Setup unique ID debounce
    this.deviceForm.get('deviceUid')?.valueChanges.subscribe((value: string) => {
      if (value && value.trim().length > 0) {
        this.onUniqueIdChange(value);
      }
    });
  }

  // Commented out - using new unique ID validation with debounce
  // getDeviceId(serachvalue: any) {
  //   if(this.selectedDeviceData?.deviceId == serachvalue){
  //     this.isUniqueIdDuplicate = false;
  //     return;
  //   }
  //   this.customerService.duplicateDevice(serachvalue).subscribe((res: any) => {
  //     this.isUniqueIdDuplicate = res?.body?.Result.Data;
  //   })
  // }

  // Commented out - using new device type structure
  // onSelectedDevice(event: any) {
  //   const value = event.split('-')
  //   this.DevicemakerTypeId = value[0]
  //   this.deviceMakerId = value[1]
  // }


  submit(formvalue: any) {
    if (this.deviceForm.invalid || this.isUniqueIdDuplicate || this.isCheckingUniqueId) {
      this.deviceForm.markAllAsTouched();
      return;
    }

    const currentDate = new Date().toISOString();
    const installationDate = formvalue?.installationOn 
      ? formatDate(formvalue.installationOn, 'yyyy-MM-dd', 'en-US')
      : formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    let payload: any = {
      id: this.deviceId && this.deviceId !== 'add-device' ? parseInt(this.deviceId) : 0,
      fkDeviceType: formvalue?.fkDeviceType,
      deviceId: formvalue?.deviceImei || formvalue?.deviceUid, // Use IMEI or UID as deviceId
      deviceImei: formvalue?.deviceImei || formvalue?.deviceUid,
      deviceUid: formvalue?.deviceUid || '',
      simPhoneNumber: formvalue?.simPhoneNumber || '',
      simSecPhoneNumber: formvalue?.simSecPhoneNumber || '',
      fkSimOperator: formvalue?.fkSimOperator || 0,
      fkSecSimOperator: formvalue?.fkSecSimOperator || 0,
      fkVehicleType: formvalue?.fkVehicleType,
      vehicleNo: formvalue?.vehicleNo,
      description: formvalue?.description || '',
      planType: formvalue?.planType || null,
      installationOn: installationDate,
      lastUpdateOn: currentDate,
      creationTime: this.selectedDeviceData?.creationTime || currentDate,
      attributes: this.selectedDeviceData?.attribute 
        ? JSON.stringify({ ...this.selectedDeviceData.attribute, batterySerialNo: formvalue?.serialNumber || '' })
        : JSON.stringify({ batterySerialNo: formvalue?.serialNumber || '' })
    };

    this.spinnerLoading = true;
    let service;
    
    if (this.deviceId && this.deviceId !== 'add-device') {
      // Update existing device
      service = this.deviceManageService.updateDevice(parseInt(this.deviceId), payload);
    } else {
      // Add new device
      service = this.deviceManageService.addDevice(payload);
    }

    service.subscribe((res: any) => {
      this.spinnerLoading = false;
      // Handle 201 (Created) status code for POST requests and 200 for PUT requests
      if ((res?.status === 200 || res?.status === 201) && res?.body?.result === true) {
        this.notificationService.showSuccess('Device saved successfully');
        this.router.navigateByUrl('admin/device/device-manage');
        this.refreshCustomerService.announceCustomerAdded();
      } else if ((res?.status === 200 || res?.status === 201) && res?.body?.data) {
        // Handle case where device is created (201) but response format might be different
        // Some APIs return the created object directly in data field
        this.notificationService.showSuccess('Device saved successfully');
        this.router.navigateByUrl('admin/device/device-manage');
        this.refreshCustomerService.announceCustomerAdded();
      } else if ((res?.status === 200 || res?.status === 201) && res?.body?.id != null) {
        // Handle case where API returns 201 with the created device object directly as body (no result/data wrapper)
        this.notificationService.showSuccess('Device saved successfully');
        this.router.navigateByUrl('admin/device/device-manage');
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        // Handle error response: {"result":false,"data":"Duplicate device unique id."}
        let errorMsg = 'Failed to save device';
        if (res?.body?.result === false && res?.body?.data) {
          errorMsg = res.body.data; // Error message is in the data field
          // If it's a duplicate unique ID error, set form error
          if (errorMsg.toLowerCase().includes('duplicate') && errorMsg.toLowerCase().includes('unique id')) {
            this.isUniqueIdDuplicate = true;
            this.deviceForm.get('deviceUid')?.setErrors({ duplicate: true });
            this.deviceForm.get('deviceUid')?.markAsTouched();
          }
        } else {
          errorMsg = res?.error?.message || res?.body?.message || errorMsg;
        }
        this.notificationService.showError(errorMsg);
      }
    }, (error: any) => {
      this.spinnerLoading = false;
      let errorMsg = error?.error?.message || error?.message || 'Failed to save device';
      
      // Handle error response in error object
      if (error?.error?.result === false && error?.error?.data) {
        errorMsg = error.error.data;
        // If it's a duplicate unique ID error, set form error
        if (errorMsg.toLowerCase().includes('duplicate') && errorMsg.toLowerCase().includes('unique id')) {
          this.isUniqueIdDuplicate = true;
          this.deviceForm.get('deviceUid')?.setErrors({ duplicate: true });
          this.deviceForm.get('deviceUid')?.markAsTouched();
        }
      }
      
      this.notificationService.showError(errorMsg);
    });
  }
  cancel(event: any) {
    if (event) {
      event.preventDefault();
    }
    this.bsmodalService.hide();
    // Navigate back to device list
    this.router.navigateByUrl('admin/device/device-manage');
  }

  close() {
    this.bsmodalService.hide();
    // Navigate back to device list
    this.router.navigateByUrl('admin/device/device-manage');
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
