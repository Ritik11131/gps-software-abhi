import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTrackingComponent } from './history-tracking.component';

describe('HistoryTrackingComponent', () => {
  let component: HistoryTrackingComponent;
  let fixture: ComponentFixture<HistoryTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
