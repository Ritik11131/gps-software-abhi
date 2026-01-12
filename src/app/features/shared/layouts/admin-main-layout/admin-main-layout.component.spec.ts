import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainLayoutComponent } from './admin-main-layout.component';

describe('AdminMainLayoutComponent', () => {
  let component: AdminMainLayoutComponent;
  let fixture: ComponentFixture<AdminMainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMainLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
