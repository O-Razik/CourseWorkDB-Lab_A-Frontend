import {Component, Input, HostListener, OnInit, Output, EventEmitter} from '@angular/core';
import { InventoryInLaboratory } from '../../../data/models/inventory-in-laboratory';
import { Inventory } from '../../../data/models/inventory';
import { DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { InventoryInLaboratoryViewComponent } from '../inventory-in-laboratory-view/inventory-in-laboratory-view.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-group-in-lab-view',
  standalone: true,
  imports: [
    CommonModule,
    InventoryInLaboratoryViewComponent,
    MatExpansionModule,
    MatGridListModule
  ],
  templateUrl: './inventory-group-in-lab-view.component.html',
  styleUrls: ['./inventory-group-in-lab-view.component.css']
})
export class InventoryGroupInLabViewComponent implements OnInit {
  @Input() inventoryGroup!: {
    inventory: Inventory;
    items: InventoryInLaboratory[];
  };

  // For responsive grid columns
  gridCols = 4;

  @Input() selectedInventoryId: number | null = null;
  @Output() inventorySelected = new EventEmitter<InventoryInLaboratory>();

  selectInventory(item: InventoryInLaboratory) {
    this.inventorySelected.emit(item);
  }

  ngOnInit() {
    this.onResize(); // Initialize columns on component load
  }

  get totalQuantity(): number {
    return this.inventoryGroup.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Listen to window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    const width = window.innerWidth;
    if (width < 600) {
      this.gridCols = 1;
    } else if (width < 1400) {
      this.gridCols = 2;
    } else if (width >= 1400 && width <= 2000) {
      this.gridCols = 3;
    } else {
      this.gridCols = 4;
    }
  }
}
