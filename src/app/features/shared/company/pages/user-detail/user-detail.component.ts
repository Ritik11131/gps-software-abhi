import { Component } from '@angular/core';
import { BreadcrumbItems } from '../../../interfaces';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
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
      path: "/",
      active: true,
    },
  ];
}
