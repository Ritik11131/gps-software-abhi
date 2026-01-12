import { Component } from '@angular/core';
import { CustomerManageService } from '../../../serices/customer-manage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PlanModifyComponent } from '../plan-modify/plan-modify.component';
import { DeviceManageService } from 'src/app/features/admin/device/device-manage/service/device-manage.service';

@Component({
  selector: 'app-manage-plane',
  templateUrl: './manage-plane.component.html',
  styleUrls: ['./manage-plane.component.scss']
})
export class ManagePlaneComponent {
  planDuration: any
  planForm!: FormGroup;
  dealerId: any;
  customerId: any;
  planData: any;
  getPlan: any;
  // serviceCharge = ['Device Purchase', 'Service', 'Device + Service', 'Device Rent'];
  serviceCharge = [{id:1, name:'Device Purchase'}, {id:2, name:'Service'}, {id:3, name:'Device + Service'}, {id:4, name:'Device Rent'}];
  manufacture = []
  dealerData = ['CONCOX', 'BW08' ]
  statusData = [{id:1, status:'Active'}, {id:0, status:'In Active'}]
  bsModelRef! : BsModalRef
  routePath:any = 'admin/customer/customer-manage'
  makerType: any;
  devicemakerList: any;

  constructor(
    private CustomerManageService: CustomerManageService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService,
    private modelService: BsModalService,
    private deviceManageService: DeviceManageService

  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('cusID');
      this.getPlanDurationData();
      this.getPlanData()
    });
  }

  ngOnInit() {
    this.setInitialValue();
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("cusID");
    this.getPlanDurationData();
    this.getPlanData();
    this.getdevicemaker()
  }

  setInitialValue() {
    this.planForm = this.fb.group({
      manufacture: [null, [Validators.required]],
      device: [null, [Validators.required]],
      status: [null, [Validators.required]],
      plan: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      rate: ['', [Validators.required, Validators.pattern('')]],
      tax: ['', [Validators.required, Validators.pattern('')]],
      discount: ['', [Validators.required, Validators.pattern('')]]
    })
  }

  getdevicemaker() {
    this.deviceManageService.devicemaker().subscribe((res: any) => {
      this.devicemakerList = res?.body?.Result?.add;
    });
  }

  getdevicemakertype(id: any) {
    this.deviceManageService.devicemakertype(id).subscribe((res: any) => {
      this.makerType = res?.body?.Result?.add;
    })
  }


  getPlanDurationData() {
    this.CustomerManageService.customerPlanPeriod().subscribe((res: any) => {
      this.planDuration = res?.body?.Result?.Data;
    })
  }

  getPlanData() {
    this.CustomerManageService.getPlan(this.dealerId, this.customerId).subscribe((res: any) => {
      if (res?.body?.ResponseMessage == 'Success') {
        this.getPlan = res?.body?.Result?.Data;
        this.planForm = this.fb.group({
          manufacture: [null, [Validators.required]],
          device: [null, [Validators.required]],
          status: [null, [Validators.required]],
          plan: [null, [Validators.required]],
          duration: [this.getPlan.PeriodId, [Validators.required]],
          rate: [this.getPlan?.Rate, [Validators.required, Validators.pattern('')]],
          tax: [this.getPlan?.Tax, [Validators.required, Validators.pattern('')]],
          discount: ['', [Validators.required, Validators.pattern('')]]
        })
      }

    })
  }


  submit(formvalue: any) {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }
    // let payload = {
    //   "Id": 0,
    //   "Reseller": {
    //     "Id": Number(this.dealerId)
    //   },
    //   "CustomerId": this.customerId,
    //   "PeriodId": formvalue.duration,
    //   "Rate": formvalue.rate,
    //   "Tax": formvalue?.tax,
    //   "Makers":formvalue?.manufacture,
    //   "deviceid":formvalue?.device,
    //   "status":formvalue?.status,
    //   "Planid":formvalue?.plan,
    //   "Discount": Number(formvalue?.discount)
    // };
   let payload =  {
      "Id": 0,
      "Reseller": {
          "Id": Number(this.dealerId)
      },
      "CustomerId": Number(this.customerId),
      "PeriodId": Number(formvalue?.duration),
      "Rate": formvalue.rate,
      "Tax": formvalue?.tax.toString()
  }
    
    let service = this.CustomerManageService.addCustomerPlan(payload);
    if (this.getPlan?.Id) {
      payload['Id'] = this.getPlan?.Id
      service = this.CustomerManageService.updateCustomerPlan(this.getPlan?.Id, payload)
    }

    service.subscribe((res: any) => {
      if (res?.body?.ResponseMessage == "Success") {
        this.planData = res?.body?.Result?.Data;
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.router.navigateByUrl('admin/customer/customer-manage')
        this.refreshCustomerService.announceCustomerAdded();
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }

    })
  }


  Cancel(event:any) {
    event.preventDefault()
    this.planForm.reset()
  }

  openManage() {
    const initialState: ModalOptions = {

    };
    this.bsModelRef = this.modelService.show(
      PlanModifyComponent,
      Object.assign(initialState, {
        id: 'confirmationModal',
        class: 'modal-md modal-dialog-centered',
      })
    );
  }
}
