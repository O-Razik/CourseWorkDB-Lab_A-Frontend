import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisListViewComponent } from './analysis-list-view.component';

describe('AnalysisListViewComponent', () => {
  let component: AnalysisListViewComponent;
  let fixture: ComponentFixture<AnalysisListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
