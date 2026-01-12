import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLocationsComponent } from './vehicle-locations.component';

describe('VehicleLocationsComponent', () => {
  let component: VehicleLocationsComponent;
  let fixture: ComponentFixture<VehicleLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleLocationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
