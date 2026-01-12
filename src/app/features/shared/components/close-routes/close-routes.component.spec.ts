import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseRoutesComponent } from './close-routes.component';

describe('CloseRoutesComponent', () => {
  let component: CloseRoutesComponent;
  let fixture: ComponentFixture<CloseRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseRoutesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
