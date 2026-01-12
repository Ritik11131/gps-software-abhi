import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDeviceDetailsComponent } from './customer-device-details.component';

describe('CustomerDeviceDetailsComponent', () => {
  let component: CustomerDeviceDetailsComponent;
  let fixture: ComponentFixture<CustomerDeviceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDeviceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDeviceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
