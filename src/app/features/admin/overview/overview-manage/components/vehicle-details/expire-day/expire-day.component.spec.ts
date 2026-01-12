import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpireDayComponent } from './expire-day.component';

describe('ExpireDayComponent', () => {
  let component: ExpireDayComponent;
  let fixture: ComponentFixture<ExpireDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpireDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpireDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
