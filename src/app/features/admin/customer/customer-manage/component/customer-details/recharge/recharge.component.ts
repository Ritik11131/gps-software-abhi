import { Component } from '@angular/core';
import { CustomerManageService } from '../../../serices/customer-manage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/features/http-services/storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent {
  serviceCharge = ['Device Purchase', 'Service', 'Device + Service', 'Device Rent']
  manufacture = []
  dealerData = [
    'CONCOX', 'BW08'
  ]
  planDuration: any;
  rechargeForm! : FormGroup
  amountDisabled:boolean = false
  dealerId: any;
  customerId: any;
  routePath:any = 'admin/customer/customer-manage'

  constructor(
    private activeRoute: ActivatedRoute,
    private CustomerManageService: CustomerManageService,
    private fb: FormBuilder,
    private storageService: StorageService,
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.dealerId = params.get('id');
      this.customerId = params.get('cusID');
      this.getPlanDurationData()
    });
  }

  ngOnInit() {
    this.dealerId = this.activeRoute.snapshot.paramMap.get("id");
    this.customerId = this.activeRoute.snapshot.paramMap.get("cusID")
      this.getPlanDurationData()
      this.setInitialValue()
      this.getuserDetail()
  }

  setInitialValue() {
    this.rechargeForm = this.fb.group({
      manufacture: [null, [Validators.required, Validators.pattern('')]],
      device : [null, [Validators.required, Validators.pattern('')]],
      plan: [null, [Validators.required, Validators.pattern('')]],
      duration: [null, [Validators.required, Validators.pattern('')]],
      qty : ['', [Validators.required, Validators.pattern('')]],
      amount: ['', [Validators.required, Validators.pattern('')]],
    })
  }

  getuserDetail(){
    this.storageService.getItem("userDetail").subscribe((value:any)=>{
      if(value?.role == 1){
        this.amountDisabled = true
      }else{
        this.amountDisabled = false
      }
    })
  }

  getPlanDurationData() {
    this.CustomerManageService.customerPlanPeriod().subscribe((res: any) => {
      this.planDuration = res?.body?.Result?.Data;
    })
  }

  submit(formValue:any){

  }

  cancel(event:any) {
    event.preventDefault()
    this.rechargeForm.reset()
  }
}
