import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeManageComponent } from './device-type-manage.component';

describe('DeviceTypeManageComponent', () => {
  let component: DeviceTypeManageComponent;
  let fixture: ComponentFixture<DeviceTypeManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceTypeManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceTypeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
