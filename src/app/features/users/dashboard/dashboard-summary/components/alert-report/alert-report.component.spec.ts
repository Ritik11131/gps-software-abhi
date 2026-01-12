import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertReportComponent } from './alert-report.component';

describe('AlertReportComponent', () => {
  let component: AlertReportComponent;
  let fixture: ComponentFixture<AlertReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
