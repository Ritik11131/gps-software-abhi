import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IOSettingsComponent } from './io-settings.component';

describe('IOSettingsComponent', () => {
  let component: IOSettingsComponent;
  let fixture: ComponentFixture<IOSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IOSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IOSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
