import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubUserManageComponent } from './sub-user-manage.component';

describe('SubUserManageComponent', () => {
  let component: SubUserManageComponent;
  let fixture: ComponentFixture<SubUserManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubUserManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubUserManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
