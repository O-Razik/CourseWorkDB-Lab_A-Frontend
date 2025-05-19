import { TestBed } from '@angular/core/testing';

import { BiomaterialDeliveryService } from './biomaterial-delivery.service';

describe('BiomaterialDeliveryService', () => {
  let service: BiomaterialDeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiomaterialDeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
