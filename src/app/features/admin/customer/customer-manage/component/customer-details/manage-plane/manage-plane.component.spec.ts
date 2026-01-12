import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePlaneComponent } from './manage-plane.component';

describe('ManagePlaneComponent', () => {
  let component: ManagePlaneComponent;
  let fixture: ComponentFixture<ManagePlaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePlaneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
