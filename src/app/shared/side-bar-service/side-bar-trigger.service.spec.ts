import { TestBed } from '@angular/core/testing';

import { SideBarTriggerService } from './side-bar-trigger.service';

describe('SideBarTriggerService', () => {
  let service: SideBarTriggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideBarTriggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
