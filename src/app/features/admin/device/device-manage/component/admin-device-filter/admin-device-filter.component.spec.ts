import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeviceFilterComponent } from './admin-device-filter.component';

describe('AdminDeviceFilterComponent', () => {
  let component: AdminDeviceFilterComponent;
  let fixture: ComponentFixture<AdminDeviceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeviceFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeviceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
