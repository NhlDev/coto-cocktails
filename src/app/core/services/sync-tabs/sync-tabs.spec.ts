import { TestBed } from '@angular/core/testing';

import { SyncTabs } from './sync-tabs';

describe('SyncTabs', () => {
  let service: SyncTabs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncTabs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
