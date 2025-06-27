import {Component, OnInit} from '@angular/core';
import {
  InventorySubListViewComponent, Mode
} from '../../sub-list-views/inventory-sub-list-view/inventory-sub-list-view.component';
import {Inventory} from '../../../../data/models/inventory';
import {InventoryService} from '../../../../data/services/inventory.service';

@Component({
  selector: 'app-inventory-list-view',
  imports: [
    InventorySubListViewComponent
  ],
  templateUrl: './inventory-list-view.component.html',
  styleUrl: './inventory-list-view.component.css',
  standalone: true,
})
export class InventoryListViewComponent implements OnInit {
  inventories: Inventory[] = [];
  mode: Mode = Mode.List; // Default mode set to List

  constructor(
    private inventoryService: InventoryService,
  ) {
  }

  ngOnInit() {
    this.loadInventories();
  }

  private loadInventories() {
    this.inventoryService.getAllInventories().subscribe({
      next: (data) => {
        this.inventories = data;
      },
      error: (error) => {
        console.error('Error loading inventories:', error);
      }
    });
  }

}
