import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorySliderControlComponent } from './history-slider-control.component';

describe('HistorySliderControlComponent', () => {
  let component: HistorySliderControlComponent;
  let fixture: ComponentFixture<HistorySliderControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorySliderControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorySliderControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
