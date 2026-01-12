import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVehiclePermissionComponent } from './user-vehicle-permission.component';

describe('UserVehiclePermissionComponent', () => {
  let component: UserVehiclePermissionComponent;
  let fixture: ComponentFixture<UserVehiclePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserVehiclePermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserVehiclePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
