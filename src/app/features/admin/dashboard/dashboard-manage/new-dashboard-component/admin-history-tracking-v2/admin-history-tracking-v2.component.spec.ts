import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistoryTrackingV2Component } from './admin-history-tracking-v2.component';

describe('AdminHistoryTrackingV2Component', () => {
  let component: AdminHistoryTrackingV2Component;
  let fixture: ComponentFixture<AdminHistoryTrackingV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHistoryTrackingV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHistoryTrackingV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
