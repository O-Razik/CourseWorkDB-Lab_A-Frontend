import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericSubListViewComponent } from '../../../generics/generic-sub-list-view/generic-sub-list-view.component';
import { InventoryViewComponent } from '../../model-view/sub-models/inventory-view/inventory-view.component';
import { Inventory } from '../../../../data/models/inventory';
import { InventoryService } from '../../../../data/services/inventory.service';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';

export enum Mode {
  List = 'list',
  SubList = 'sub-list',
  Display = 'display'
}

@Component({
  selector: 'app-inventory-sub-list-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GenericSubListViewComponent,
    InventoryViewComponent,
    MatGridList,
    MatGridTile,
    MatButtonModule,
    MatIconModule,
    MatFormField,
    MatLabel,
    MatInput
  ],
  templateUrl: './inventory-sub-list-view.component.html',
  styleUrl: './inventory-sub-list-view.component.css'
})
export class InventorySubListViewComponent implements OnInit {
  @Input() inventories: Inventory[] = [];
  @Input() mode: Mode = Mode.Display;
  @Output() inventorySelected = new EventEmitter<Inventory>();

  cols: number = 3;
  isCreating = false;
  newInventory = {
    inventoryName: '',
    price: 0
  };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    if (!this.inventories || this.inventories.length === 0) {
      this.loadInventories();
    }
    this.adjustGridColumns(window.innerWidth);
  }

  private loadInventories() {
    this.inventoryService.getAllInventories().subscribe({
      next: (inventories) => {
        this.inventories = inventories;
      },
      error: (err) => console.error('Failed to load inventories:', err)
    });
  }

  onResize(event: any) {
    this.adjustGridColumns(event.target.innerWidth);
  }

  private adjustGridColumns(width: number) {
    this.cols = Math.max(1, Math.floor(width / 300));
  }

  trackByInventoryId(index: number, inventory: Inventory): number {
    return inventory.inventoryId;
  }

  selectInventory(inventory: Inventory) {
    this.inventorySelected.emit(inventory);
  }

  startCreating() {
    this.isCreating = true;
    setTimeout(() => {
      document.querySelector('.create-panel')?.classList.add('visible');
      document.querySelector('.overlay')?.classList.add('visible');
    }, 10);
  }

  cancelCreate() {
    document.querySelector('.create-panel')?.classList.remove('visible');
    document.querySelector('.overlay')?.classList.remove('visible');
    setTimeout(() => {
      this.isCreating = false;
    }, 300);
  }

  createInventory() {
    if (!this.newInventory.inventoryName || this.newInventory.price <= 0) return;

    this.inventoryService.createInventory(this.newInventory as Inventory).subscribe({
      next: (createdInventory) => {
        this.inventories = [...this.inventories, createdInventory];
        this.isCreating = false;
      },
      error: (err) => console.error('Failed to create inventory:', err)
    });
  }

  handlePriceChange(updatedInventory: Inventory) {
    if (this.mode === 'list') {
      this.inventoryService.updateInventory(updatedInventory).subscribe({
        next: (result) => {
          const index = this.inventories.findIndex(i => i.inventoryId === result.inventoryId);
          if (index !== -1) {
            this.inventories[index] = result;
            this.inventories = [...this.inventories];
          }
        },
        error: (err) => console.error('Failed to update inventory:', err)
      });
    }
    // In sub-list mode, price changes are temporary and not persisted
  }

  protected readonly Mode = Mode;
}
