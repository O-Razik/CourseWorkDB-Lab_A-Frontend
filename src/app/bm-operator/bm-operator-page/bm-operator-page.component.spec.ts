import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmOperatorPageComponent } from './bm-operator-page.component';

describe('BmOperatorPageComponent', () => {
  let component: BmOperatorPageComponent;
  let fixture: ComponentFixture<BmOperatorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmOperatorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BmOperatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
