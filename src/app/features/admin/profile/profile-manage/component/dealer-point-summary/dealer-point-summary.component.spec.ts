import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerPointSummaryComponent } from './dealer-point-summary.component';

describe('DealerPointSummaryComponent', () => {
  let component: DealerPointSummaryComponent;
  let fixture: ComponentFixture<DealerPointSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerPointSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerPointSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
