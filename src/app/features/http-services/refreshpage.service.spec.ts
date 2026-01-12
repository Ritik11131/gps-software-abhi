import { TestBed } from '@angular/core/testing';

import { RefreshpageService } from './refreshpage.service';

describe('RefreshpageService', () => {
  let service: RefreshpageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshpageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
