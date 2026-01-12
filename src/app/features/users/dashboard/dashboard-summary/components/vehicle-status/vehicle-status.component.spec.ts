import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStatusComponent } from './vehicle-status.component';

describe('VehicleStatusComponent', () => {
  let component: VehicleStatusComponent;
  let fixture: ComponentFixture<VehicleStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
