import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpCreateTabContentComponent } from './bp-create-tab-content.component';

describe('BpCreateTabContentComponent', () => {
  let component: BpCreateTabContentComponent;
  let fixture: ComponentFixture<BpCreateTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpCreateTabContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpCreateTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
