import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AnalysisCenterViewComponent} from '../../model-view/analysis-center-view/analysis-center-view.component';
import {AnalysisCenter} from '../../../../data/models/analysis-center';
import {AnalysisCenterService} from '../../../../data/services/analysis-center.service';
import {GenericSubListViewComponent} from '../../../generics/generic-sub-list-view/generic-sub-list-view.component';

@Component({
  selector: 'app-analysis-center-sub-list-view',
  imports: [
    AnalysisCenterViewComponent,
    GenericSubListViewComponent
  ],
  templateUrl: './analysis-center-sub-list-view.component.html',
  styleUrl: './analysis-center-sub-list-view.component.css',
  standalone: true,
})
export class AnalysisCenterSubListViewComponent implements OnInit{
  centers: AnalysisCenter[] = [];
  searchPlaceholder: string = 'Пошук за назвою центру';
  searchTerm: string = '';
  emptyListMessage: string = 'Центр не знайдено';
  ifBeginLoading = true;

  @Output() selected = new EventEmitter<AnalysisCenter>();

  constructor(
    private analysisCenterService: AnalysisCenterService,
  ) {
  }

  ngOnInit() {
    this.loadCenters();
  }

  loadCenters() {
    this.analysisCenterService.getAnalysisCenters().subscribe((centers) => {
      this.centers = centers;
      this.ifBeginLoading = false;
    });
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  trackByCenterId($index: number, center: AnalysisCenter) {
    return center.analysisCenterId;
  }

  onAnalysisCenterSelected(center: AnalysisCenter) {
    this.selected.emit(center);
  }
}
