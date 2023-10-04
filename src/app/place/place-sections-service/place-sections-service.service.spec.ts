import { TestBed } from '@angular/core/testing';

import { PlaceSectionsServiceService } from './place-sections-service.service';

describe('PlaceSectionsServiceService', () => {
  let service: PlaceSectionsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceSectionsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
