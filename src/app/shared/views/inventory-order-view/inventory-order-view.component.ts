import { Component, Input } from '@angular/core';
import { InventoryOrder } from '../../../data/models/inventory-order';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {InventoryInOrderViewComponent} from '../inventory-in-order-view/inventory-in-order-view.component';

@Component({
  selector: 'app-inventory-order-view',
  standalone: true,
  imports: [
    MatTableModule,
    DatePipe,
    MatIconModule,
    InventoryInOrderViewComponent
  ],
  templateUrl: './inventory-order-view.component.html',
  styleUrls: ['./inventory-order-view.component.css']
})
export class InventoryOrderViewComponent {
  displayedColumns: string[] = ['orderDate', 'supplier'];
  @Input() order!: InventoryOrder;
}
