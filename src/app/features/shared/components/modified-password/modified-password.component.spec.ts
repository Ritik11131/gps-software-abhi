import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiedPasswordComponent } from './modified-password.component';

describe('ModifiedPasswordComponent', () => {
  let component: ModifiedPasswordComponent;
  let fixture: ComponentFixture<ModifiedPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifiedPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifiedPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
