import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveDeviceComponent } from './move-device.component';

describe('MoveDeviceComponent', () => {
  let component: MoveDeviceComponent;
  let fixture: ComponentFixture<MoveDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
