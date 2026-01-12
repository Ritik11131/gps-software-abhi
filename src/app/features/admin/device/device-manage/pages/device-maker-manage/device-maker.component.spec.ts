import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMakerComponent } from './device-maker.component';

describe('DeviceMakerComponent', () => {
  let component: DeviceMakerComponent;
  let fixture: ComponentFixture<DeviceMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceMakerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
