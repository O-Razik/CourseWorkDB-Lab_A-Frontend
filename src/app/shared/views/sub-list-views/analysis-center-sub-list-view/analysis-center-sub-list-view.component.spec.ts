import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisCenterSubListViewComponent } from './analysis-center-sub-list-view.component';

describe('AnalysisCenterSubListViewComponent', () => {
  let component: AnalysisCenterSubListViewComponent;
  let fixture: ComponentFixture<AnalysisCenterSubListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisCenterSubListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisCenterSubListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
