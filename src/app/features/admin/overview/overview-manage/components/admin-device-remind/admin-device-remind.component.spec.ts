import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeviceRemindComponent } from './admin-device-remind.component';

describe('AdminDeviceRemindComponent', () => {
  let component: AdminDeviceRemindComponent;
  let fixture: ComponentFixture<AdminDeviceRemindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeviceRemindComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeviceRemindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
