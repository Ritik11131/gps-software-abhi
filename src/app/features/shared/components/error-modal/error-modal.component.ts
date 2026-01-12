import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {
  @Input()public title:any;
  constructor( public bsModalRef: BsModalRef) { }
  ngOnInit(): void {
  }

  onHideModal() {
    this.bsModalRef.hide();
  }

}
