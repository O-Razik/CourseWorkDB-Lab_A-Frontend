import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryInOrderViewComponent } from './inventory-in-order-view.component';

describe('InventoryInOrderViewComponent', () => {
  let component: InventoryInOrderViewComponent;
  let fixture: ComponentFixture<InventoryInOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryInOrderViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryInOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
