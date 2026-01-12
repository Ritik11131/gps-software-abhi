import { Component, OnInit } from '@angular/core';
import { BreadcrumbItems } from '../../../interfaces/breadcrumb-items';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent implements OnInit {
  breadcrumbItems: BreadcrumbItems = [
    {
      name: "Home",
      path: "/residential",
      active: false,
    },

    {
      name: "My Company",
      path: "",
      active: false,
    },
    {
      name: "Manage Users",
      path: "",
      active: false,
    },
    {
      name: "My Company",
      path: "/company/manageuser",
      active: true,
    },
  ];

  spinnerLoading: any = false;
  moduleList: any;
  addUserForm!: FormGroup;
  notification: any;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getmodule()
    this.setInitValue();
    this. getnotification()
  }

  setInitValue() {
    this.addUserForm = this.fb.group({
      comp_name: ['', [Validators.required, Validators.pattern('')]],
      phn: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      add: ['', [Validators.required, Validators.pattern('')]],
      gst: ['', [Validators.required, Validators.pattern('')]],
      contect_per_no: ['', [Validators.required, Validators.pattern('')]],
      agreement: ['', [Validators.required, Validators.pattern('')]],
      comp_id: ['', [Validators.required, Validators.pattern('')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])?(?=.*[A-Z])?(?=.*[\\W]).{5,16}$')]]
    })
  }

   
  getmodule() {
    this.spinnerLoading = true;
    this.companyService.getmodulelist().subscribe(
      (res) => {
        this.moduleList = res?.body;
        this.spinnerLoading = false;
      },
      (err: any) => {
        this.spinnerLoading = false;
      }
    );
  }
     
  getnotification() {
    this.spinnerLoading = true;
    this.companyService.getnotification().subscribe(
      (res) => {
        this.notification = res?.body;
        this.spinnerLoading = false;
      },
      (err: any) => {
        this.spinnerLoading = false;
      }
    );
  }

  submit(formValue: any) {
  }
  nagivateTocompany(){
    this.router.navigate(["/company/manageuser"]);
  }
}
