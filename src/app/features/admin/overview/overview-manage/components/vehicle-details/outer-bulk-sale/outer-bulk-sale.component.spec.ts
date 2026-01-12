import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuterBulkSaleComponent } from './outer-bulk-sale.component';

describe('OuterBulkSaleComponent', () => {
  let component: OuterBulkSaleComponent;
  let fixture: ComponentFixture<OuterBulkSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuterBulkSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OuterBulkSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
