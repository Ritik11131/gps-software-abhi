import { TestBed } from '@angular/core/testing';

import { PointSummaryService } from './point-summary.service';

describe('PointSummaryService', () => {
  let service: PointSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
