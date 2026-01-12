import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSaleComponent } from './bulk-sale.component';

describe('BulkSaleComponent', () => {
  let component: BulkSaleComponent;
  let fixture: ComponentFixture<BulkSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
