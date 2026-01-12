import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCustomerComponent } from './shift-customer.component';

describe('ShiftCustomerComponent', () => {
  let component: ShiftCustomerComponent;
  let fixture: ComponentFixture<ShiftCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
