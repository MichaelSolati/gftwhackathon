import { TestBed } from '@angular/core/testing';

import { ViewersCollectionService } from './viewers-collection.service';

describe('ViewersCollectionService', () => {
  let service: ViewersCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewersCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
