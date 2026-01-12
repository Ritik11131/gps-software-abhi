import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistoryTrackingComponent } from './admin-history-tracking.component';

describe('AdminHistoryTrackingComponent', () => {
  let component: AdminHistoryTrackingComponent;
  let fixture: ComponentFixture<AdminHistoryTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHistoryTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHistoryTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
