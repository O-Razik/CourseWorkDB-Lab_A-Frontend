import {Component, Input} from '@angular/core';
import {ClientOrder} from '../../../../../data/models/client-order';
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
import {MatIcon} from '@angular/material/icon';
import {AnalysisResultViewComponent} from '../analysis-result-view/analysis-result-view.component';
import {MatIconButton} from '@angular/material/button';
import {AnalysisResult} from '../../../../../data/models/analysis-result';
import {OrderAnalysis} from '../../../../../data/models/order-analysis';
import {ClientOrderService} from '../../../../../data/services/client-order.service';

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
    NgClass,
    MatIcon,
    AnalysisResultViewComponent,
    MatIconButton
  ],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.css',
  standalone: true
})
export class OrderViewComponent {
  displayedColumns: string[] = ['collectionDate', 'employee', 'client'];
  @Input() order!: ClientOrder;

  selectedOrderAnalysis : OrderAnalysis | null = null;
  selectedAnalysisResults: AnalysisResult[] | null = null;
  selectedAnalysisFor: number | null = null;

  constructor(private clientOrderService: ClientOrderService) {
  }

  showAnalysisResults(results: AnalysisResult[], orderAnalysis: OrderAnalysis): void {
    this.selectedOrderAnalysis = orderAnalysis;
    this.selectedAnalysisResults = results;
    this.selectedAnalysisFor = this.selectedOrderAnalysis.orderAnalysisId;
  }

  closeResultsModal(): void {
    this.selectedAnalysisResults = null;
    this.selectedAnalysisFor = null;
  }

  getStatusClass(statusName: string | undefined): string {
    if (!statusName) return 'status-default';
    switch(statusName.toLowerCase()) {
      case 'в процесі': return 'status-in-process';
      case 'завершений': return 'status-completed';
      case 'скасований': return 'status-canceled';
      default: return 'status-default';
    }
  }

  showCancelOption = false;

  toggleCancelOption(): void {
    if (this.canBeCancelled()) {
      this.showCancelOption = !this.showCancelOption;
    }
  }

  canBeCancelled(): boolean {
    return this.order?.status?.statusName?.toLowerCase() !== 'завершений';
  }

  cancelOrder(event: Event): void {
    event.stopPropagation();
    this.showCancelOption = false;

    if (!this.canBeCancelled()) return;

    this.clientOrderService.cancelOrder(this.order.clientOrderId).subscribe({
      next: (updatedOrder) => {
        this.order.status = updatedOrder.status;
      },
      error: (err) => {
        console.error('Failed to cancel order', err);
        alert('Не вдалося скасувати замовлення.');
      }
    });
  }

}
