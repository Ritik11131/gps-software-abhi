import { TestBed } from '@angular/core/testing';

import { SimOperatorService } from './sim-operator.service';

describe('SimOperatorService', () => {
  let service: SimOperatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimOperatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
