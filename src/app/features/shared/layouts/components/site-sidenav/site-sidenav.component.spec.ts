import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSidenavComponent } from './site-sidenav.component';

describe('SiteSidenavComponent', () => {
  let component: SiteSidenavComponent;
  let fixture: ComponentFixture<SiteSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteSidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
