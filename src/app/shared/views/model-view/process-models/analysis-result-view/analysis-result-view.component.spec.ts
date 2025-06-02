import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisResultViewComponent } from './analysis-result-view.component';

describe('AnalysisResultViewComponent', () => {
  let component: AnalysisResultViewComponent;
  let fixture: ComponentFixture<AnalysisResultViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisResultViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisResultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
