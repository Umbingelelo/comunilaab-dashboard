import { TestBed } from '@angular/core/testing';

import { QrLocationService } from './qr-location.service';

describe('QrLocationService', () => {
  let service: QrLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
