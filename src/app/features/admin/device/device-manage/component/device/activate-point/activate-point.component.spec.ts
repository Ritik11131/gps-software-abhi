import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatePointComponent } from './activate-point.component';

describe('ActivatePointComponent', () => {
  let component: ActivatePointComponent;
  let fixture: ComponentFixture<ActivatePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivatePointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivatePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
