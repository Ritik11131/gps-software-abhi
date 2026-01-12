import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAccessComponent } from './dashboard-access.component';

describe('DashboardAccessComponent', () => {
  let component: DashboardAccessComponent;
  let fixture: ComponentFixture<DashboardAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
