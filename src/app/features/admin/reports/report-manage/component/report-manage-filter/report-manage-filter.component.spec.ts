import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManageFilterComponent } from './report-manage-filter.component';

describe('ReportManageFilterComponent', () => {
  let component: ReportManageFilterComponent;
  let fixture: ComponentFixture<ReportManageFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportManageFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportManageFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
