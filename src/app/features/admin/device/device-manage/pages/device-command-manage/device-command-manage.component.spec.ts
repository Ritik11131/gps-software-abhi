import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCommandManageComponent } from './device-command-manage.component';

describe('DeviceCommandManageComponent', () => {
  let component: DeviceCommandManageComponent;
  let fixture: ComponentFixture<DeviceCommandManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceCommandManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceCommandManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
