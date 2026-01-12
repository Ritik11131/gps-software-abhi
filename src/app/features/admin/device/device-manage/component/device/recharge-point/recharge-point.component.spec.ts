import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargePointComponent } from './recharge-point.component';

describe('RechargePointComponent', () => {
  let component: RechargePointComponent;
  let fixture: ComponentFixture<RechargePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargePointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
