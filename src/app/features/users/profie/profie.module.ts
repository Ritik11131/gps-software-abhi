import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfieRoutingModule } from './profie-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfieRoutingModule,
    SharedModule
  ]
})
export class ProfieModule { }
