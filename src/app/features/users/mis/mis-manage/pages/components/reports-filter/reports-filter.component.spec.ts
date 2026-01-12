import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsFilterComponent } from './reports-filter.component';

describe('ReportsFilterComponent', () => {
  let component: ReportsFilterComponent;
  let fixture: ComponentFixture<ReportsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
