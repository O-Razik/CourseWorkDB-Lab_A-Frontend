import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryInLaboratoryViewComponent } from './inventory-in-laboratory-view.component';

describe('InventoryInLaboratoryViewComponent', () => {
  let component: InventoryInLaboratoryViewComponent;
  let fixture: ComponentFixture<InventoryInLaboratoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryInLaboratoryViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryInLaboratoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
