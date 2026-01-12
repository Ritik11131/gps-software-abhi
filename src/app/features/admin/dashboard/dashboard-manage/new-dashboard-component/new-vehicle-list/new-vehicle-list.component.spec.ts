import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVehicleListComponent } from './new-vehicle-list.component';

describe('NewVehicleListComponent', () => {
  let component: NewVehicleListComponent;
  let fixture: ComponentFixture<NewVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewVehicleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
