import { TestBed } from '@angular/core/testing';

import { AnalysisCategoryService } from './analysis-category.service';

describe('AnalysisCategoryService', () => {
  let service: AnalysisCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalysisCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
