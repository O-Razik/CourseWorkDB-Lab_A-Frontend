import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpCreateOrderSummaryComponent } from './bp-create-order-summary.component';

describe('BpCreateOrderSummaryComponent', () => {
  let component: BpCreateOrderSummaryComponent;
  let fixture: ComponentFixture<BpCreateOrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpCreateOrderSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpCreateOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
