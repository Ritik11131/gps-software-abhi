import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationInMapComponent } from './location-in-map.component';

describe('LocationInMapComponent', () => {
  let component: LocationInMapComponent;
  let fixture: ComponentFixture<LocationInMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationInMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationInMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
