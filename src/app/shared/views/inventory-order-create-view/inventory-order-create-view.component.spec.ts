import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOrderCreateViewComponent } from './inventory-order-create-view.component';

describe('InventoryOrderCreateViewComponent', () => {
  let component: InventoryOrderCreateViewComponent;
  let fixture: ComponentFixture<InventoryOrderCreateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryOrderCreateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOrderCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
