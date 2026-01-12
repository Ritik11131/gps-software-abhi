import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkySwitchButtonComponent } from './sky-switch-button.component';

describe('SkySwitchButtonComponent', () => {
  let component: SkySwitchButtonComponent;
  let fixture: ComponentFixture<SkySwitchButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkySwitchButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkySwitchButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
