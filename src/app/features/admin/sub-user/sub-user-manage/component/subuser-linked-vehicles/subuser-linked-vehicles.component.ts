import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SubUserService } from '../../services/sub-user.service';

@Component({
  selector: 'subuser-linked-vehicles',
  templateUrl: './subuser-linked-vehicles.component.html',
  styleUrls: ['./subuser-linked-vehicles.component.scss']
})
export class SubuserLinkedVehiclesComponent implements OnInit {
  userId!: number;
  userName: string = '';
  vehicles: any[] = [];
  loading: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private subUserService: SubUserService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.subUserService.getDevicesByUserId(this.userId).subscribe((res: any) => {
      this.loading = false;
      if (res?.body?.result === true) {
        this.vehicles = res.body.data || [];
      } else {
        this.vehicles = [];
      }
    }, () => {
      this.loading = false;
      this.vehicles = [];
    });
  }

  close(): void {
    this.bsModalRef.hide();
  }
}
