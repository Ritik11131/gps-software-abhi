import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { ManageUserComponent } from './pages/manage-user/manage-user.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyBreadcrumbComponent } from '../components/sky-breadcrumb/sky-breadcrumb.component';
import { SharedModule } from '../shared.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
    declarations: [
        AddUserComponent,
        EditUserComponent,
        ManageUserComponent,
        UserDetailComponent,
    ],
    imports: [
        CommonModule,
        CompanyRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgxPaginationModule
        
    ]
})
export class CompanyModule { }
