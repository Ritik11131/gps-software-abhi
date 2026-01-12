import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimDashboardComponent } from './sim-dashboard.component';

describe('SimDashboardComponent', () => {
  let component: SimDashboardComponent;
  let fixture: ComponentFixture<SimDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
