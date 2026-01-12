import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCustomerDetailOverviewComponent } from './all-customer-detail-overview.component';

describe('AllCustomerDetailOverviewComponent', () => {
  let component: AllCustomerDetailOverviewComponent;
  let fixture: ComponentFixture<AllCustomerDetailOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCustomerDetailOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCustomerDetailOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
