import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFitmentComponent } from './show-fitment.component';

describe('ShowFitmentComponent', () => {
  let component: ShowFitmentComponent;
  let fixture: ComponentFixture<ShowFitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowFitmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowFitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
