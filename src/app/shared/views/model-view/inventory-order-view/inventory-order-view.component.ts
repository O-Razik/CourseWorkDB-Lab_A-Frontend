import { Component, Input } from '@angular/core';
import { InventoryOrder } from '../../../../data/models/inventory-order';
import { MatTableModule } from '@angular/material/table';
import {DatePipe, NgClass} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {InventoryInOrderViewComponent} from '../inventory-in-order-view/inventory-in-order-view.component';

@Component({
  selector: 'app-inventory-order-view',
  standalone: true,
  imports: [
    MatTableModule,
    DatePipe,
    MatIconModule,
    InventoryInOrderViewComponent,
    NgClass
  ],
  templateUrl: './inventory-order-view.component.html',
  styleUrls: ['./inventory-order-view.component.css']
})
export class InventoryOrderViewComponent {
  displayedColumns: string[] = ['orderDate', 'supplier'];
  @Input() order!: InventoryOrder;

  getStatusClass(statusName: string | undefined): string {
    if (!statusName) return 'status-default';

    switch(statusName.toLowerCase()) {
      case 'в процесі':
        return 'status-in-process';
      case 'завершений':
        return 'status-completed';
      case 'скасований':
        return 'status-canceled';
      default:
        return 'status-default';
    }
  }
}
