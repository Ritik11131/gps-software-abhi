import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofanceComponent } from './geofance.component';

describe('GeofanceComponent', () => {
  let component: GeofanceComponent;
  let fixture: ComponentFixture<GeofanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeofanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeofanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
