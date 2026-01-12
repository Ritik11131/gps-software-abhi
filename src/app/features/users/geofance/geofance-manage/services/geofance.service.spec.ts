import { TestBed } from '@angular/core/testing';

import { GeofanceService } from './geofance.service';

describe('GeofanceService', () => {
  let service: GeofanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeofanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
