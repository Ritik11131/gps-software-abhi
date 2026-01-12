import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveAccountComponent } from './move-account.component';

describe('MoveAccountComponent', () => {
  let component: MoveAccountComponent;
  let fixture: ComponentFixture<MoveAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
