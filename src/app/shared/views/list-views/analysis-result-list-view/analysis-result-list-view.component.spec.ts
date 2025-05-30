import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisResultListViewComponent } from './analysis-result-list-view.component';

describe('AnalysisResultListViewComponent', () => {
  let component: AnalysisResultListViewComponent;
  let fixture: ComponentFixture<AnalysisResultListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisResultListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisResultListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
