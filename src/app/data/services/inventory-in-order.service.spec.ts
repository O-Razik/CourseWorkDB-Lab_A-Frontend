import { TestBed } from '@angular/core/testing';

import { InventoryInOrderService } from './inventory-in-order.service';

describe('InventoryInOrderService', () => {
  let service: InventoryInOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryInOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
