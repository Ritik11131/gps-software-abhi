import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubuserFilterComponent } from './subuser-filter.component';

describe('SubuserFilterComponent', () => {
  let component: SubuserFilterComponent;
  let fixture: ComponentFixture<SubuserFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubuserFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubuserFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
