import { TestBed } from '@angular/core/testing';

import { SidebarTriggerService } from './sidebar-trigger.service';

describe('SidebarTriggerService', () => {
  let service: SidebarTriggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarTriggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
