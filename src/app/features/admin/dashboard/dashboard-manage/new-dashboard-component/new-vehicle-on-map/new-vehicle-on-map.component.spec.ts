import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVehicleOnMapComponent } from './new-vehicle-on-map.component';

describe('NewVehicleOnMapComponent', () => {
  let component: NewVehicleOnMapComponent;
  let fixture: ComponentFixture<NewVehicleOnMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewVehicleOnMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewVehicleOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
