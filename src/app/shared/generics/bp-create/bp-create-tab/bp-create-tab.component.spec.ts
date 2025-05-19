import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpCreateTabComponent } from './bp-create-tab.component';

describe('BpCreateTabComponent', () => {
  let component: BpCreateTabComponent;
  let fixture: ComponentFixture<BpCreateTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpCreateTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpCreateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
