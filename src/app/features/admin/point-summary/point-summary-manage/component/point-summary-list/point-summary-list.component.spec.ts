import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointSummaryListComponent } from './point-summary-list.component';

describe('PointSummaryListComponent', () => {
  let component: PointSummaryListComponent;
  let fixture: ComponentFixture<PointSummaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointSummaryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
