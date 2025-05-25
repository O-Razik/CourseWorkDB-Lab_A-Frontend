import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisCenterViewComponent } from './analysis-center-view.component';

describe('AnalysisCenterViewComponent', () => {
  let component: AnalysisCenterViewComponent;
  let fixture: ComponentFixture<AnalysisCenterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisCenterViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisCenterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
