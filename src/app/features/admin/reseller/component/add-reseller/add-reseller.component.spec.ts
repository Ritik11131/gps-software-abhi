import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResellerComponent } from './add-reseller.component';

describe('AddResellerComponent', () => {
  let component: AddResellerComponent;
  let fixture: ComponentFixture<AddResellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddResellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddResellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
