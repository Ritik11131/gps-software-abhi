import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimBillSummaryComponent } from './sim-bill-summary.component';

describe('SimBillSummaryComponent', () => {
  let component: SimBillSummaryComponent;
  let fixture: ComponentFixture<SimBillSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimBillSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimBillSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
