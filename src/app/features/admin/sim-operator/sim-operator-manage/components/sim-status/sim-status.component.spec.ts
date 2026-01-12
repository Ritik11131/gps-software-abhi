import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimStatusComponent } from './sim-status.component';

describe('SimStatusComponent', () => {
  let component: SimStatusComponent;
  let fixture: ComponentFixture<SimStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
