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
import {DatePipe, NgClass} from '@angular/common';

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
    MatRowDef,
    NgClass
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
