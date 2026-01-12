import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubuserListComponent } from './subuser-list.component';

describe('SubuserListComponent', () => {
  let component: SubuserListComponent;
  let fixture: ComponentFixture<SubuserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubuserListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubuserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
