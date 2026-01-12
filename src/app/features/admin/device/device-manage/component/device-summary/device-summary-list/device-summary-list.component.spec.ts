import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSummaryListComponent } from './device-summary-list.component';

describe('DeviceSummaryListComponent', () => {
  let component: DeviceSummaryListComponent;
  let fixture: ComponentFixture<DeviceSummaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceSummaryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
