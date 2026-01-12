import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyLogoComponent } from './sky-logo.component';

describe('SkyLogoComponent', () => {
  let component: SkyLogoComponent;
  let fixture: ComponentFixture<SkyLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkyLogoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
