import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryInLaboratoryListViewComponent } from './inventory-in-laboratory-list-view.component';

describe('InventoryInLaboratoryListViewComponent', () => {
  let component: InventoryInLaboratoryListViewComponent;
  let fixture: ComponentFixture<InventoryInLaboratoryListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryInLaboratoryListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryInLaboratoryListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
