import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySubuserComponent } from './modify-subuser.component';

describe('ModifySubuserComponent', () => {
  let component: ModifySubuserComponent;
  let fixture: ComponentFixture<ModifySubuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifySubuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifySubuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
