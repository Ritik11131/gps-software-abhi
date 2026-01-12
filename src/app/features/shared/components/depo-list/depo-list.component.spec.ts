import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepoListComponent } from './depo-list.component';

describe('DepoListComponent', () => {
  let component: DepoListComponent;
  let fixture: ComponentFixture<DepoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepoListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
