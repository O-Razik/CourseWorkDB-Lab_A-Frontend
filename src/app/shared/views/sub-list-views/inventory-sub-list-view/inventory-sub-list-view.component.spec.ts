import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySubListViewComponent } from './inventory-sub-list-view.component';

describe('InventorySubListViewComponent', () => {
  let component: InventorySubListViewComponent;
  let fixture: ComponentFixture<InventorySubListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySubListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorySubListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
