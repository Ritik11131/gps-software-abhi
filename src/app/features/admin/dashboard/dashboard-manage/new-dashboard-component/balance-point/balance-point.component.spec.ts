import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalancePointComponent } from './balance-point.component';

describe('BalancePointComponent', () => {
  let component: BalancePointComponent;
  let fixture: ComponentFixture<BalancePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalancePointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalancePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
