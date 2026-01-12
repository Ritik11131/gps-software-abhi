import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyBreadcrumbComponent } from './sky-breadcrumb.component';

describe('SkyBreadcrumbComponent', () => {
  let component: SkyBreadcrumbComponent;
  let fixture: ComponentFixture<SkyBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkyBreadcrumbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
