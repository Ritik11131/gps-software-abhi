import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSettingComponent } from './advance-setting.component';

describe('AdvanceSettingComponent', () => {
  let component: AdvanceSettingComponent;
  let fixture: ComponentFixture<AdvanceSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
