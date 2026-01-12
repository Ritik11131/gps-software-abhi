import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubuserVehicleComponent } from './subuser-vehicle.component';

describe('SubuserVehicleComponent', () => {
  let component: SubuserVehicleComponent;
  let fixture: ComponentFixture<SubuserVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubuserVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubuserVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
