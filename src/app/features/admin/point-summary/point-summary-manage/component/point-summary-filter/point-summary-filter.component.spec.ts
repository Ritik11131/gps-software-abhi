import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointSummaryFilterComponent } from './point-summary-filter.component';

describe('PointSummaryFilterComponent', () => {
  let component: PointSummaryFilterComponent;
  let fixture: ComponentFixture<PointSummaryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointSummaryFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointSummaryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
