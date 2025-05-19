import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpCreateSummarySectionComponent } from './bp-create-summary-section.component';

describe('BpCreateSummarySectionComponent', () => {
  let component: BpCreateSummarySectionComponent;
  let fixture: ComponentFixture<BpCreateSummarySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpCreateSummarySectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpCreateSummarySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
