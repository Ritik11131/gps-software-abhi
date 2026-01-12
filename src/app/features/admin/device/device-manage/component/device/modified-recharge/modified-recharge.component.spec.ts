import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiedRechargeComponent } from './modified-recharge.component';

describe('ModifiedRechargeComponent', () => {
  let component: ModifiedRechargeComponent;
  let fixture: ComponentFixture<ModifiedRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifiedRechargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifiedRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
