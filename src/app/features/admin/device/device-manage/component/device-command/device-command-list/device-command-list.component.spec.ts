import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCommandListComponent } from './device-command-list.component';

describe('DeviceCommandListComponent', () => {
  let component: DeviceCommandListComponent;
  let fixture: ComponentFixture<DeviceCommandListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceCommandListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceCommandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
