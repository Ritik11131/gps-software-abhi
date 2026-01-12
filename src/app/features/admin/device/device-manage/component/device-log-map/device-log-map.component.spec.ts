import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceLogMapComponent } from './device-log-map.component';

describe('DeviceLogMapComponent', () => {
  let component: DeviceLogMapComponent;
  let fixture: ComponentFixture<DeviceLogMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceLogMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceLogMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
