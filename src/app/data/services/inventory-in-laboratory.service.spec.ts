import { TestBed } from '@angular/core/testing';

import { InventoryInLaboratoryService } from './inventory-in-laboratory.service';

describe('InventoryInLaboratoryService', () => {
  let service: InventoryInLaboratoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryInLaboratoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
