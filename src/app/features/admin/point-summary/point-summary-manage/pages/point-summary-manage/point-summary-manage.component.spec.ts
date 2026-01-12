import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointSummaryManageComponent } from './point-summary-manage.component';

describe('PointSummaryManageComponent', () => {
  let component: PointSummaryManageComponent;
  let fixture: ComponentFixture<PointSummaryManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointSummaryManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointSummaryManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
