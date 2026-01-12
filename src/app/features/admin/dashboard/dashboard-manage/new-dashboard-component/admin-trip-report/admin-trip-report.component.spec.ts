import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTripReportComponent } from './admin-trip-report.component';

describe('AdminTripReportComponent', () => {
  let component: AdminTripReportComponent;
  let fixture: ComponentFixture<AdminTripReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTripReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTripReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
