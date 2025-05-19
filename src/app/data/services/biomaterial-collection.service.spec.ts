import { TestBed } from '@angular/core/testing';

import { BiomaterialCollectionService } from './biomaterial-collection.service';

describe('BiomaterialCollectionService', () => {
  let service: BiomaterialCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiomaterialCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
