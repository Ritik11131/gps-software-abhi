import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillOdometerComponent } from './fill-odometer.component';

describe('FillOdometerComponent', () => {
  let component: FillOdometerComponent;
  let fixture: ComponentFixture<FillOdometerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FillOdometerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FillOdometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
