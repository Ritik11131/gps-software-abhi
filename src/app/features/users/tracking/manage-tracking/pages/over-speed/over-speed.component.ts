import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-over-speed',
  templateUrl: './over-speed.component.html',
  styleUrls: ['./over-speed.component.scss']
})
export class OverSpeedComponent {
  @Output() mapdata = new EventEmitter();
  overSpeed:any
  constructor(
    private modelService: BsModalService
  ) {

  }

  submit() {    
    this.modelService.hide();
    this.mapdata.emit(this.overSpeed)
  }

  cancel() {
    this.overSpeed = ''
    this.mapdata.emit(this.overSpeed)
    this.modelService.hide() 
  }
}
