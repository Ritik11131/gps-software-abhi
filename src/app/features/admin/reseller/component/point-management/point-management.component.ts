import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResellerService } from '../../service/reseller.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-point-management',
  templateUrl: './point-management.component.html',
  styleUrls: ['./point-management.component.scss']
})
export class PointManagementComponent {

  pointForm!: FormGroup;
  dealerId: any;
  routePath:any = 'admin/reseller-raster'
  constructor(
    private fb: FormBuilder,
    private resellerService : ResellerService,
    private notificationService: NotificationService,
    private refreshCustomerService: RefreshCustomerService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id")
    this.setInitialvalue()
  }

  setInitialvalue() {
    this.pointForm = this.fb.group({
      plan: ["1", [Validators.required]],
      transation : ["1", [Validators.required]],
      pointCount: ['', [Validators.required, , this.validatePointCount]]
    })
  }

  validatePointCount(control: AbstractControl) {
    if (control.value !== null && control.value !== '' && Number(control.value) <= 0) {
      return { invalidPointCount: true };
    }
    return null;
  }

  submit(formvalue:any) {
    if (this.pointForm.invalid) {
      this.pointForm.markAllAsTouched();
      return;
    }
    let payload :any 
    let service :any
    if(formvalue?.transation == '1'){
      payload = {
        "ToDealerId": Number(this.dealerId),
        "PointType": Number(formvalue?.plan),
        "PointCount": Number(formvalue?.pointCount)
      }
      service = this.resellerService.DebitPoint(payload)
    } else {
      payload = {
        "FromDealerId":  Number(this.dealerId),
        "PointType":  Number(formvalue?.plan),
        "PointCount": Number(formvalue?.pointCount)
    }
      service = this.resellerService.CreditPoint(payload)
    }

    service.subscribe((res:any) => {
      if(res?.body?.ResponseMessage == "Success") {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.router.navigateByUrl('admin/reseller-raster');
        this.refreshCustomerService.announceCustomerAdded();

      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }

  cancel(event:any) {
    event.preventDefault()
    this.pointForm.reset()
  }
}
