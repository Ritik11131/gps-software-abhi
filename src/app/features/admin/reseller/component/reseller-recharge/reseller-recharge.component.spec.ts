import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerRechargeComponent } from './reseller-recharge.component';

describe('ResellerRechargeComponent', () => {
  let component: ResellerRechargeComponent;
  let fixture: ComponentFixture<ResellerRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResellerRechargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResellerRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
