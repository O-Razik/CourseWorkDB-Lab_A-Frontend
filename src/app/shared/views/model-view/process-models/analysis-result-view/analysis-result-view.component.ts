import { Component, Input } from '@angular/core';
import { AnalysisResult } from '../../../../../data/models/analysis-result';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import {AnalysisResultService} from '../../../../../data/services/analysis-result.service';

@Component({
  selector: 'app-analysis-result-view',
  templateUrl: './analysis-result-view.component.html',
  styleUrls: ['./analysis-result-view.component.css'],
  standalone: true,
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
  ]
})
export class AnalysisResultViewComponent {
  executionColumns: string[] = ['executionDate', 'center'];
  indicatorColumns: string[] = ['indicator', 'description'];
  @Input() analysisResult!: AnalysisResult;

  constructor(private analysisResultService: AnalysisResultService) {}

  downloadPdf() {
    if (!this.analysisResult?.analysisResultId) return;

    this.analysisResultService.downloadPdf(this.analysisResult.analysisResultId).subscribe({
      next: (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analysis_result_${this.analysisResult.analysisResultId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error downloading PDF:', err);
        // Handle error (show toast/snackbar)
      }
    });
  }
}
