import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleOnMapComponent } from './vehicle-on-map.component';

describe('VehicleOnMapComponent', () => {
  let component: VehicleOnMapComponent;
  let fixture: ComponentFixture<VehicleOnMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleOnMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
