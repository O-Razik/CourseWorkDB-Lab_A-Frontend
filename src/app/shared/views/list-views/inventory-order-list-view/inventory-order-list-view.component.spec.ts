import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderListViewComponent } from './inventory-order-list-view.component';

describe('InventoryOrderListViewComponent', () => {
  let component: InventoryOrderListViewComponent;
  let fixture: ComponentFixture<InventoryOrderListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryOrderListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
