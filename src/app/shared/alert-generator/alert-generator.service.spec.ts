import { TestBed } from '@angular/core/testing';

import { AlertGeneratorService } from './alert-generator.service';

describe('AlertGeneratorService', () => {
  let service: AlertGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
