import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceCommandComponent } from './add-device-command.component';

describe('AddDeviceCommandComponent', () => {
  let component: AddDeviceCommandComponent;
  let fixture: ComponentFixture<AddDeviceCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeviceCommandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeviceCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
