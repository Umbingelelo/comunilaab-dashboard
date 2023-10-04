/* eslint-disable max-lines-per-function */
import { TestBed } from '@angular/core/testing';

import { AuthGuard } from '../can-activate.guard';

describe('CanActivateGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthGuard,
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
