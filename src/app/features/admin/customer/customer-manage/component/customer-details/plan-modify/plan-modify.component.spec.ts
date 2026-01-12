import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanModifyComponent } from './plan-modify.component';

describe('PlanModifyComponent', () => {
  let component: PlanModifyComponent;
  let fixture: ComponentFixture<PlanModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanModifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
