import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGeofanceComponent } from './create-geofance.component';

describe('CreateGeofanceComponent', () => {
  let component: CreateGeofanceComponent;
  let fixture: ComponentFixture<CreateGeofanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGeofanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGeofanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
