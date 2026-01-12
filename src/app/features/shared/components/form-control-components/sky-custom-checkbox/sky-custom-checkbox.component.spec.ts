import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyCustomCheckboxComponent } from './sky-custom-checkbox.component';

describe('SkyCustomCheckboxComponent', () => {
  let component: SkyCustomCheckboxComponent;
  let fixture: ComponentFixture<SkyCustomCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkyCustomCheckboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyCustomCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
