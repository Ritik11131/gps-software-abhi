import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLiveTrackingComponent } from './user-live-tracking.component';

describe('UserLiveTrackingComponent', () => {
  let component: UserLiveTrackingComponent;
  let fixture: ComponentFixture<UserLiveTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLiveTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLiveTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
