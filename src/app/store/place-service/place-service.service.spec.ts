import { TestBed } from '@angular/core/testing';

import { CategoryService } from './place-service.service';

describe('PlaceService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
