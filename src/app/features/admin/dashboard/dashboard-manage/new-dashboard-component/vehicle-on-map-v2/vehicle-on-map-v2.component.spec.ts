import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleOnMapV2Component } from './vehicle-on-map-v2.component';

describe('VehicleOnMapV2Component', () => {
  let component: VehicleOnMapV2Component;
  let fixture: ComponentFixture<VehicleOnMapV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleOnMapV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleOnMapV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
