import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceMakerComponent } from './add-device-maker.component';

describe('AddDeviceMakerComponent', () => {
  let component: AddDeviceMakerComponent;
  let fixture: ComponentFixture<AddDeviceMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeviceMakerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDeviceMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
