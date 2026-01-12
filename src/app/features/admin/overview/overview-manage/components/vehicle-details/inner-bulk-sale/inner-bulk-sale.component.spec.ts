import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerBulkSaleComponent } from './inner-bulk-sale.component';

describe('InnerBulkSaleComponent', () => {
  let component: InnerBulkSaleComponent;
  let fixture: ComponentFixture<InnerBulkSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerBulkSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerBulkSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
