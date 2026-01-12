import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyBrowserAlertComponent } from './sky-browser-alert.component';

describe('SkyBrowserAlertComponent', () => {
  let component: SkyBrowserAlertComponent;
  let fixture: ComponentFixture<SkyBrowserAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkyBrowserAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyBrowserAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
