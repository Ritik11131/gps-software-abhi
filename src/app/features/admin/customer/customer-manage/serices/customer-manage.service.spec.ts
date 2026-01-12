import { TestBed } from '@angular/core/testing';

import { CustomerManageService } from './customer-manage.service';

describe('CustomerManageService', () => {
  let service: CustomerManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
