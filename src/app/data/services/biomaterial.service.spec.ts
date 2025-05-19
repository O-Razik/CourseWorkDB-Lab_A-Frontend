import { TestBed } from '@angular/core/testing';

import { BiomaterialService } from './biomaterial.service';

describe('BiomaterialService', () => {
  let service: BiomaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiomaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
