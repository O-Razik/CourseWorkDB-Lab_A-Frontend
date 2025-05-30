import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GenericSubListViewComponent} from '../../../generics/generic-sub-list-view/generic-sub-list-view.component';
import {InventoryViewComponent} from '../../model-view/inventory-view/inventory-view.component';
import {Inventory} from '../../../../data/models/inventory';
import {InventoryService} from '../../../../data/services/inventory.service';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';

@Component({
  selector: 'app-inventory-sub-list-view',
  imports: [
    GenericSubListViewComponent,
    InventoryViewComponent,
    MatGridList,
    MatGridTile
  ],
  templateUrl: './inventory-sub-list-view.component.html',
  standalone: true,
  styleUrl: './inventory-sub-list-view.component.css'
})
export class InventorySubListViewComponent implements OnInit{
 @Input() inventories: Inventory[] = [];
 @Output() inventorySelected = new EventEmitter<Inventory>();
  cols: number = 3;

  constructor(
    private inventoryService: InventoryService,
  ) {
  }

  ngOnInit() {
    if(!this.inventories || this.inventories.length === 0) {
      this.inventoryService.getAllInventories().subscribe((inventories: Inventory[]) => {
        this.inventories = inventories;
      });
    }
  }

  onResize(event: any) {
    this.cols = Math.floor(event.target.innerWidth / 600);
  }

  trackByInventoryId(index: number, inventory: Inventory): number {
    return inventory.inventoryId;
  }

  selectInventory(inventory: Inventory) {
    this.inventorySelected.emit(inventory);
  }
}
