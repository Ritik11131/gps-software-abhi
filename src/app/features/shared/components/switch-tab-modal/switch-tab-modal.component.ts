import { Component, OnInit } from '@angular/core';
import { BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-switch-tab-modal',
  templateUrl: './switch-tab-modal.component.html',
  styleUrls: ['./switch-tab-modal.component.scss']
})
export class SwitchTabModalComponent implements OnInit {
  onAction: Function = () => { };

  constructor(private modalService: BsModalService) { }

  handleAction() {
    this.onAction();
    this.modalService.hide("switchtab");
  }

  ngOnInit(): void { }
}

