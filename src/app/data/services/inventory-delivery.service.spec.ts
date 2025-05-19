import { TestBed } from '@angular/core/testing';

import { InventoryDeliveryService } from './inventory-delivery.service';

describe('InventoryDeliveryService', () => {
  let service: InventoryDeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryDeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
