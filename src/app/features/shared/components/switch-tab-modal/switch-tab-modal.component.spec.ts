import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchTabModalComponent } from './switch-tab-modal.component';

describe('SwitchTabModalComponent', () => {
  let component: SwitchTabModalComponent;
  let fixture: ComponentFixture<SwitchTabModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchTabModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchTabModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
