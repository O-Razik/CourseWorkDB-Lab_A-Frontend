import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Analysis} from '../../../../data/models/analysis';

@Component({
  selector: 'app-analysis-view',
  imports: [],
  templateUrl: './analysis-view.component.html',
  styleUrl: './analysis-view.component.css',
  standalone: true,
})
export class AnalysisViewComponent {
  @Input() analysis!: Analysis;
  @Output() priceClick = new EventEmitter<Analysis>();

  onPriceClick() {
    this.priceClick.emit(this.analysis);
  }
}
