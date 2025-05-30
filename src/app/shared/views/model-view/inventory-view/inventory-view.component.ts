import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Inventory} from '../../../../data/models/inventory';

@Component({
  selector: 'app-inventory-view',
  imports: [],
  templateUrl: './inventory-view.component.html',
  styleUrl: './inventory-view.component.css',
  standalone: true,
})
export class InventoryViewComponent {
  @Input() inventory: Inventory = null!;
  @Output() inventorySelected = new EventEmitter<Inventory>();

  onClick() {
    this.inventorySelected.emit(this.inventory);
  }
}
