import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceBulkUploadComponent } from './device-bulk-upload.component';

describe('DeviceBulkUploadComponent', () => {
  let component: DeviceBulkUploadComponent;
  let fixture: ComponentFixture<DeviceBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceBulkUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
