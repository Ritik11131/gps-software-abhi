import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointManagementComponent } from './point-management.component';

describe('PointManagementComponent', () => {
  let component: PointManagementComponent;
  let fixture: ComponentFixture<PointManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
