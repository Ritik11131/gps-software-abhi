import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripReportComponent } from './trip-report.component';

describe('TripReportComponent', () => {
  let component: TripReportComponent;
  let fixture: ComponentFixture<TripReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
