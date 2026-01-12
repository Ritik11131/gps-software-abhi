import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveSelectDeviceOverviewComponent } from './move-select-device-overview.component';

describe('MoveSelectDeviceOverviewComponent', () => {
  let component: MoveSelectDeviceOverviewComponent;
  let fixture: ComponentFixture<MoveSelectDeviceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveSelectDeviceOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveSelectDeviceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
