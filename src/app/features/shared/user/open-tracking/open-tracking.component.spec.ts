import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenTrackingComponent } from './open-tracking.component';

describe('OpenTrackingComponent', () => {
  let component: OpenTrackingComponent;
  let fixture: ComponentFixture<OpenTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
