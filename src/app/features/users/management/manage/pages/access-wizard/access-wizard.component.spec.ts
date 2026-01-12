import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessWizardComponent } from './access-wizard.component';

describe('AccessWizardComponent', () => {
  let component: AccessWizardComponent;
  let fixture: ComponentFixture<AccessWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessWizardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
