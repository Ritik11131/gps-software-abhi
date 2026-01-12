import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkActivatedDeviceComponent } from './bulk-activated-device.component';

describe('BulkActivatedDeviceComponent', () => {
  let component: BulkActivatedDeviceComponent;
  let fixture: ComponentFixture<BulkActivatedDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkActivatedDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkActivatedDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
