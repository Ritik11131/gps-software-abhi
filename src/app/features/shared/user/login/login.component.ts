import { Component } from '@angular/core';
import { SwitchButton } from '../../interfaces/switch-button';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from '../../components/error-modal/error-modal.component';
import { TokenService } from 'src/app/features/http-services/token.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, animate, style } from '@angular/animations';
import { AuthService } from 'src/app/features/http-services/auth-gaurd.service';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
      transition('* => void', [
        style({ opacity: 1 }),
        animate('1000ms', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class LoginComponent {
  viewType: string = "swatch";
  // spinnerLoading: boolean = false;
  registerForm!: FormGroup;
  modalRef?: BsModalRef;
  bsModalRef?: BsModalRef;
  img_list = [
    'assets/images/1.jpg',
    'assets/images/2.jpg',
    'assets/images/3.jpg',
    'assets/images/4.jpg',
  ];
  current = 0;
  submitted: boolean = false;
  private timer: any;
  bulk = [
    {
      id: 1,
      title: 'Customer',
    },
    {
      id: 2,
      title: 'Dealer/Reseller',
    },]
  showPassword: boolean = false;

  constructor(private authService: AuthService,
    private modalService: BsModalService,
    public tokenService: TokenService, private router: Router) { }
  switchBtnConfig: SwitchButton = {
    leftLabel: "Admin",
    leftValue: "Admin",
    rightLabel: "User",
    rightValue: "user",
    id: "image-mode",
  };

  ngOnInit() {
    this.setFormValue();
    this.startSlideShow();
    if (this.authService.isLoggedIn()) {
      this.router.navigate([localStorage.getItem('activeRoute')]);
      return;
    }
  }

  ngAfterViewInit() {
    const video: HTMLVideoElement = document.getElementById('background-video') as HTMLVideoElement;
    video.muted = true; 
    const playVideo = () => {
      video.play().catch(error => {
        document.addEventListener('click', () => video.play());
      });
    };
    playVideo();

    document.addEventListener('click', () => {
      video.play();
    });
  }

  setFormValue() {
    this.registerForm = new FormGroup(
      {
        filterBy: new FormControl(
          'Customer',
          Validators.compose([Validators.required])
        ),
        username: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
        password: new FormControl(
          '',
          Validators.compose([Validators.required, Validators.minLength(3)])
        ),
      },
      {}
    );
  }

  /**
   *  register form controls
   */
  get f() {
    return this.registerForm.controls;
  }

  onSwitch(data: string) {
    this.viewType = data;
    // const anyService = this.owlCar as any;
    // const carouselService = anyService.carouselService as CarouselService;
    // carouselService.register("");
    // carouselService.refresh();
    // this.cd.detectChanges();
  }

  isLoading: boolean = false;

  onSubmit(formValue: any) {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.tokenService.getloginstatus();
    this.tokenService.generateToken(formValue).subscribe(
      (response:any) => {
        this.isLoading = false;
      },
      (error:any) => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.stopSlideShow();
  }

  startSlideShow() {
    this.timer = setInterval(() => {
      this.current = (this.current + 1) % this.img_list.length;
    }, 2000); // Change slide every 3 seconds (adjust as needed)
  }

  stopSlideShow() {
    clearInterval(this.timer);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    const initialState: ModalOptions = {
      initialState: {},
    };
    this.bsModalRef = this.modalService.show(
      ForgotPasswordComponent,
      Object.assign(initialState, { class: "modal-md modal-dialog-centered alert-popup" })
    );
  }
}
