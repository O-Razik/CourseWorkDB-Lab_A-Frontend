import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmOperatorDashboardComponent } from './bm-operator-dashboard.component';

describe('BmOperatorDashboardComponent', () => {
  let component: BmOperatorDashboardComponent;
  let fixture: ComponentFixture<BmOperatorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmOperatorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BmOperatorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
