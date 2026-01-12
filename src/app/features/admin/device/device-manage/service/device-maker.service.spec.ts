import { TestBed } from '@angular/core/testing';

import { DeviceMakerService } from './device-maker.service';

describe('DeviceMakerService', () => {
  let service: DeviceMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
