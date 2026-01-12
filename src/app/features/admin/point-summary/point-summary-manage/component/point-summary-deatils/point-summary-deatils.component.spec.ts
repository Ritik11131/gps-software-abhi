import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointSummaryDeatilsComponent } from './point-summary-deatils.component';

describe('PointSummaryDeatilsComponent', () => {
  let component: PointSummaryDeatilsComponent;
  let fixture: ComponentFixture<PointSummaryDeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointSummaryDeatilsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointSummaryDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
