import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimListComponent } from './sim-list.component';

describe('SimListComponent', () => {
  let component: SimListComponent;
  let fixture: ComponentFixture<SimListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
