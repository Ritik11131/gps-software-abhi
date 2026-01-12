import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManageListComponent } from './report-manage-list.component';

describe('ReportManageListComponent', () => {
  let component: ReportManageListComponent;
  let fixture: ComponentFixture<ReportManageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportManageListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportManageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
