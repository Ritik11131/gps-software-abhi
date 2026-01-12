import { TestBed } from '@angular/core/testing';

import { RefreshCustomerService } from './refresh-customer.service';

describe('RefreshCustomerService', () => {
  let service: RefreshCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
