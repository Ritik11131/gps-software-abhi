import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewService } from 'src/app/features/admin/overview/overview-manage/services/overview.service';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { RefreshpageService } from 'src/app/features/http-services/refreshpage.service';
import { RefreshCustomerService } from 'src/app/features/shared/services/refresh-customer.service';
import { CustomerManageService } from '../../../serices/customer-manage.service';
import { SharedService } from 'src/app/features/http-services/shared.service';

@Component({
  selector: 'add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent {
  @Input() selectedDealerId: any
  customerForm!: FormGroup;
  showPassword: boolean = false;
  customer: any;
  routePath:any = 'admin/customer/customer-manage'
  @Output() customerData = new EventEmitter();
  role = [
    {id: 2, title: 'Reseller/Dealer'},
    {id: 4, title: 'Customer'},
  ]
  statusData = [{ id: 0, staus: 'Active' }, { id: 1, staus: 'Inactive' }];
  duplicateLoginId: any;
  dealerData: any;
  selectedDealer: any;

  constructor(
    private fb: FormBuilder,
    private overviewService: OverviewService,
    private notificationService: NotificationService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private refreshCustomerService: RefreshCustomerService,
    private refreshpage: RefreshpageService,
    private customerService: CustomerManageService,
    private sharedService: SharedService
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.selectedDealerId = this.activeRoute.snapshot.paramMap.get("id")
    });
   }

  ngOnInit() { 
    this.setInitialValue();
    this.getDealerlist() 
    this.selectedDealerId = this.activeRoute.snapshot.paramMap.get("id")
  }

  getDealerlist() {
    this.sharedService.getDealerData().subscribe((res: any) => {
      this.dealerData = res?.body?.Result?.Data;
      this.selectedDealer = this.dealerData.find((val:any) => val.Id == this.selectedDealerId); 
      if (this.selectedDealer) {
        this.customerForm.controls['email'].patchValue(this.selectedDealer?.EmailId)
      }
    })
  }


  setInitialValue() {
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.pattern('')]],
      userName: ['', [Validators.required, Validators.pattern('')]],
      password: ['abc123', [Validators.required, Validators.pattern('')]],
      email: ['', [Validators.required, Validators.email]],
      phn: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      Address: [''],
      status: [0, [Validators.required]],
    })
    if (this.customerForm.get('userName')) {
      this.customerForm.get('userName')!.valueChanges.subscribe((value: any) => {
        this.getLoginId(value)
      });
    }
   
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getLoginId(serachvalue: any) {    
    let params = {
      "id":serachvalue
    }
    this.customerService.duplicateLoginId(params).subscribe((res: any) => {
      this.duplicateLoginId = res?.Result?.DuplicateCustomerLoginId      
    })
  }

  submit(formvalue: any) {    
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    let payload = {
      "Id": 0,
      "DealerId": Number(this.selectedDealerId),
      "CustomerName": formvalue.customerName,
      "User": {
        "Id": 0,
        "CustomerId": 0,
        "LoginId": formvalue.userName,
        "Password": formvalue.password,
        "MobileNo": null,
        "IsActive": formvalue.status,
        "Type": 1,
        "Reseller": {
          "Id": Number(this.selectedDealerId)
        }
      },
      "Email": formvalue.email,
      "ContactNumber": formvalue.phn,
      "Address": formvalue.Address
    }

    this.overviewService.addCustomer(payload).subscribe((res: any) => {      
      if(res?.body?.ResponseMessage == "Success") {
        this.customer = res?.body?.Result?.Data;
        this.addCustomerUserDetails(formvalue)
      } else {
        this.notificationService.showError(res?.error?.Error?.Message)
      }
    })
  }

  addCustomerUserDetails(formvalue: any) {
    let payload = {
      "Id": 0,
      "CustomerId": this.customer,
      "LoginId": formvalue.userName,
      "Password": formvalue.password,
      "MobileNo": formvalue.phn,
      "Emailid" : formvalue.email,
      "Type": 1,
      "Reseller": {
        "Id": this.selectedDealerId
      }
    }
    
    this.overviewService.addCustomerUser(payload).subscribe((res:any) => {
      if(res?.body?.ResponseMessage == "Success") {
        this.notificationService.showSuccess(res?.body?.Result?.Message);
        this.customerForm.reset();
        this.customerData.emit(this.selectedDealerId);
        this.router.navigateByUrl('admin/customer/customer-manage')
        this.refreshCustomerService.announceCustomerAdded();
      } else if(res?.error.ResponseMessage == "Failed") {
        this.notificationService.showError(res?.error?.Error?.Message[0]?.ErrorMessage)
      }
    })
  }

  cancel(event:any) {
    event.preventDefault();
    this.customerForm.reset()
  }
}
