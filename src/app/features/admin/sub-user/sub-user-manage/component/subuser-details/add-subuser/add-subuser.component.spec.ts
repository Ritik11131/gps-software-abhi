import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubuserComponent } from './add-subuser.component';

describe('AddSubuserComponent', () => {
  let component: AddSubuserComponent;
  let fixture: ComponentFixture<AddSubuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
