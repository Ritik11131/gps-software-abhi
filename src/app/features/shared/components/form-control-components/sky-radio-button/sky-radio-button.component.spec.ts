import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyRadioButtonComponent } from './sky-radio-button.component';

describe('SkyRadioButtonComponent', () => {
  let component: SkyRadioButtonComponent;
  let fixture: ComponentFixture<SkyRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkyRadioButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
