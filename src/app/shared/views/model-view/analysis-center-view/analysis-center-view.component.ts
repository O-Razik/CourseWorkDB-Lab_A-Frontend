import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AnalysisCenter} from '../../../../data/models/analysis-center';

@Component({
  selector: 'app-analysis-center-view',
  imports: [],
  templateUrl: './analysis-center-view.component.html',
  styleUrl: './analysis-center-view.component.css',
  standalone: true,
})
export class AnalysisCenterViewComponent {
  @Input() center: AnalysisCenter = {} as AnalysisCenter;
  @Output() selected = new EventEmitter<AnalysisCenter>();

  onAnalysisCenterClick() {
    this.selected.emit(this.center);
  }
}
