import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { NotificationService } from 'src/app/features/http-services/notification.service';
import { BreadcrumbItems } from 'src/app/features/shared/interfaces';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  breadcrumbItems: BreadcrumbItems = [
    {
      name: "Home",
      path: "/residential",
      active: false,
    },

   
    
    {
      name: "Inquiry Type",
      path: "",
      active: true,
    },
  ];
  addUserForm!: FormGroup;
  alertTrigger: boolean | undefined;
  alertData: any;
  alertType: any;
  typelist: any;
  public configuration!: Config;
  public columns!: Columns[];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private NotificationService:NotificationService
  ) { }
  ngOnInit(){
    this.configuration= { ...DefaultConfig };
    this.configuration.checkboxes = false;
    this.configuration.tableLayout.striped = true;
    this.configuration.tableLayout.hover = false;
    this.configuration.paginationRangeEnabled = false;
    this.configuration.paginationEnabled = false;
    this.columns = [
     
      { key: 'type', title: 'type' },
      { key: 'action', title: 'Action' },
    
    ];
    this.setInitValue();
    this.gettypelist()
  }
  setInitValue() {
    this.addUserForm = this.fb.group({
      comp_name: ['', [Validators.required, Validators.pattern('')]],
        })
  }
  submit(formValue: any) {
   

  }
  gettypelist() {
  
  }
}
