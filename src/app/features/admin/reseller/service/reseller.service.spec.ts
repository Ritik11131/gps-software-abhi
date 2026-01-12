import { TestBed } from '@angular/core/testing';

import { ResellerService } from './reseller.service';

describe('ResellerService', () => {
  let service: ResellerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResellerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
