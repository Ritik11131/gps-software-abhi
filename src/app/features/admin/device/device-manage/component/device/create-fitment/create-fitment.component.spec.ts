import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFitmentComponent } from './create-fitment.component';

describe('CreateFitmentComponent', () => {
  let component: CreateFitmentComponent;
  let fixture: ComponentFixture<CreateFitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFitmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
