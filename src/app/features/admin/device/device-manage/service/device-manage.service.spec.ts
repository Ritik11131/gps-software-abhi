import { TestBed } from '@angular/core/testing';

import { DeviceManageService } from './device-manage.service';

describe('DeviceManageService', () => {
  let service: DeviceManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
