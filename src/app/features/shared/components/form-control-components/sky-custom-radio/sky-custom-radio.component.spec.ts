import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyCustomRadioComponent } from './sky-custom-radio.component';

describe('SkyCustomRadioComponent', () => {
  let component: SkyCustomRadioComponent;
  let fixture: ComponentFixture<SkyCustomRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkyCustomRadioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyCustomRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
