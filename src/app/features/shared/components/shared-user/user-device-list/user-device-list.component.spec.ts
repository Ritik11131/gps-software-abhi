import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeviceListComponent } from './user-device-list.component';

describe('UserDeviceListComponent', () => {
  let component: UserDeviceListComponent;
  let fixture: ComponentFixture<UserDeviceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDeviceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDeviceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
