import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimOperatorManageComponent } from './sim-operator-manage.component';

describe('SimOperatorManageComponent', () => {
  let component: SimOperatorManageComponent;
  let fixture: ComponentFixture<SimOperatorManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimOperatorManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimOperatorManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
