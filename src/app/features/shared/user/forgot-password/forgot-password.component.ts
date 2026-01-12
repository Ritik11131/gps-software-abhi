import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/features/http-services/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  passwordForm!: FormGroup;
  bulk = [
    { value: 'customer', title: 'Customer' },
    { value: 'reseller', title: 'Dealer/Reseller' }
  ];
  userDetail: any;
  showSuccessDetail = false;
  errorMessage: any;
  errorDetail = false;
  selectedData: any;
  disableSendButton = false;
  resendAttempts = 0;
  timer = 0;
  timerInterval: any;
  buttonText = 'Send Request';
  showTimer: boolean = false;
  showMessage: any;
  showMessageLimit: boolean = false;
  showEmailId: boolean = false;
  selectedType: any;
  successMessage: any;
  spinnerLoading:boolean =false

  constructor(
    private userService: UserService,
    private bsModalService: BsModalService,
    private fb: FormBuilder,
    private notificationService:NotificationService
  ) { }

  ngOnInit() {
    this.setInitialValue();
    this.changeStatus();
  }

  changeStatus() {
    this.passwordForm.get('username')?.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        this.showSuccessDetail = false;
        this.errorDetail = false;
      }
    });
  }

  setInitialValue() {
    this.passwordForm = this.fb.group({
      filterBy: [null, [Validators.required]],
      username: ['', [Validators.required]],
      contactMethod: [null, [Validators.required]]
    });
  }

  onSelected(event: any) {
    this.selectedData = event;
    this.showSuccessDetail = false
    this.showEmailId = false
    this.buttonText = 'Send Request';
    this.disableSendButton = false;
    this.showTimer = false
  }

  selectedOption(event: any) {
    this.selectedType = event
  }

  getPasswordDetails(username: any) {
    this.spinnerLoading =true
    let url: any;
    if (this.selectedData === 'customer') {
      url = this.userService.passwordDetail(username);
    }
    else if (this.selectedData === 'reseller') {
      this.showEmailId = true
      url = this.userService.dealerPasswordDetail(username);
    }
    url.subscribe((res: any) => {
      this.spinnerLoading =false
      if (res.status === 200) {
        this.showSuccessDetail = true;
        this.errorDetail = false;
        this.userDetail = res?.body?.Result[0];
      } else {
        this.showSuccessDetail = false;
        this.errorDetail = true;
        this.errorMessage = res?.error?.Error?.Data;
      }
    });
  }

  sendRequest(formValue:any) {
    let url:any
    let payload:any
    if (this.resendAttempts < 3) {
      this.resendAttempts++;
      this.buttonText = 'Resend Request';
      this.showTimer = true
      this.startTimer();
    } else {
      this.showMessageLimit = true
      this.disableSendButton = true;
      this.showMessage = 'Your Limit Exceeded, Kindly Contact Support Team'
    }

    payload = {
      user:formValue?.filterBy,
      loginId:formValue?.username
    }
    if(this.selectedType == 'Email'){
      this.successMessage = 'Your Password Send Succesfully in Your Registered Email Id'
      this.errorMessage = 'Password Not Sent Kindly Retry'
      url = this.userService.sentEmailRequest(payload);
    }else if(this.selectedType == 'Mobile'){
      this.successMessage = 'Your Password Send Succesfully in Your Registered Mobile No.'
      this.errorMessage = 'Password Not Sent Kindly Retry'
      url = this.userService.sentMobileRequest(payload);
    }

    url.subscribe((res:any)=>{
      if(res?.Result?.status == "success"){
        this.notificationService.showSuccess(this.successMessage);
        this.bsModalService.hide();
      }else{
        this.notificationService.showError(this.errorMessage);
      }
      
    })
  }

  startTimer() {
    this.timer = 30;
    this.disableSendButton = true;
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.disableSendButton = false;
      }
    }, 1000);
  }

  cancel() {
    this.bsModalService.hide();
  }
}
