import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeviceDetailComponent } from './admin-device-detail.component';

describe('AdminDeviceDetailComponent', () => {
  let component: AdminDeviceDetailComponent;
  let fixture: ComponentFixture<AdminDeviceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeviceDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeviceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
