import { TestBed } from '@angular/core/testing';

import { AnalysisCenterService } from './analysis-center.service';

describe('AnalysisCenterService', () => {
  let service: AnalysisCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalysisCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
