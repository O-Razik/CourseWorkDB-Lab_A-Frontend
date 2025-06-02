import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderViewComponent } from './inventory-order-view.component';

describe('InventoryOrderViewComponent', () => {
  let component: InventoryOrderViewComponent;
  let fixture: ComponentFixture<InventoryOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryOrderViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
