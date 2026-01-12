import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutConfirmationDialogeComponent } from './logout-confirmation-dialoge.component';

describe('LogoutConfirmationDialogeComponent', () => {
  let component: LogoutConfirmationDialogeComponent;
  let fixture: ComponentFixture<LogoutConfirmationDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoutConfirmationDialogeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoutConfirmationDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
