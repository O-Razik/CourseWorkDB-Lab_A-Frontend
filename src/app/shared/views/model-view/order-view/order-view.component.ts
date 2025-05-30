import {Component, Input} from '@angular/core';
import {ClientOrder} from '../../../../data/models/client-order';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-order-view',
  imports: [
    MatTable,
    DatePipe,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatRow,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef
  ],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.css',
  standalone: true
})
export class OrderViewComponent {
  displayedColumns: string[] = ['collectionDate', 'employee', 'client'];
  @Input() order!: ClientOrder;

  constructor(
  ) { }
}
