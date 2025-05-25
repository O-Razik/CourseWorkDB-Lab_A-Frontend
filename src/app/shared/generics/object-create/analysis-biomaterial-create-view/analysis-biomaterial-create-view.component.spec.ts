import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisBiomaterialCreateViewComponent } from './analysis-biomaterial-create-view.component';

describe('AnalysisBiomaterialCreateViewComponent', () => {
  let component: AnalysisBiomaterialCreateViewComponent;
  let fixture: ComponentFixture<AnalysisBiomaterialCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisBiomaterialCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisBiomaterialCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
