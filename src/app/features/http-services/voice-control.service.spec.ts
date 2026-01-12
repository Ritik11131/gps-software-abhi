import { TestBed } from '@angular/core/testing';

import { VoiceControlService } from './voice-control.service';

describe('VoiceControlService', () => {
  let service: VoiceControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
