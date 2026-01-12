import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTrackingComponent } from './group-tracking.component';

describe('GroupTrackingComponent', () => {
  let component: GroupTrackingComponent;
  let fixture: ComponentFixture<GroupTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
