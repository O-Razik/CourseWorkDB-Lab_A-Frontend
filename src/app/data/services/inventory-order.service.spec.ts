import { TestBed } from '@angular/core/testing';

import { InventoryOrderService } from './inventory-order.service';

describe('InventoryOrderService', () => {
  let service: InventoryOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
