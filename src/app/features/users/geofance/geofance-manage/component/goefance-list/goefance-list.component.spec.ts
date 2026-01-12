import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoefanceListComponent } from './goefance-list.component';

describe('GoefanceListComponent', () => {
  let component: GoefanceListComponent;
  let fixture: ComponentFixture<GoefanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoefanceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoefanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
