import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() alertData: any = {};
  @Input() alertType: any = {};
  data: any;
  constructor() { }

  ngOnInit(): void {
    this.data = this.alertData;
  }
}
