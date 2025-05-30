import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisCreateViewComponent } from './analysis-create-view.component';

describe('AnalysisCreateViewComponent', () => {
  let component: AnalysisCreateViewComponent;
  let fixture: ComponentFixture<AnalysisCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
