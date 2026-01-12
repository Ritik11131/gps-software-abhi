import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGeofanceV2Component } from './create-geofance-v2.component';

describe('CreateGeofanceV2Component', () => {
  let component: CreateGeofanceV2Component;
  let fixture: ComponentFixture<CreateGeofanceV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGeofanceV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGeofanceV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
