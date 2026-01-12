import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceFitlerComponent } from './device-fitler.component';

describe('DeviceFitlerComponent', () => {
  let component: DeviceFitlerComponent;
  let fixture: ComponentFixture<DeviceFitlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceFitlerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceFitlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
