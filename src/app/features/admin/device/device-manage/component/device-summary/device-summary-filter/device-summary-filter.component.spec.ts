import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSummaryFilterComponent } from './device-summary-filter.component';

describe('DeviceSummaryFilterComponent', () => {
  let component: DeviceSummaryFilterComponent;
  let fixture: ComponentFixture<DeviceSummaryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceSummaryFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceSummaryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
