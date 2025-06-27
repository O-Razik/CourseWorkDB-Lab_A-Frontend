import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryListViewComponent } from './inventory-list-view.component';

describe('InventoryListViewComponent', () => {
  let component: InventoryListViewComponent;
  let fixture: ComponentFixture<InventoryListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
