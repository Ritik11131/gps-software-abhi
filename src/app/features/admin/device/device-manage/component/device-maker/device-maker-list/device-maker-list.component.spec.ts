import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceMakerListComponent } from './device-maker-list.component';

describe('DeviceMakerListComponent', () => {
  let component: DeviceMakerListComponent;
  let fixture: ComponentFixture<DeviceMakerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceMakerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceMakerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
