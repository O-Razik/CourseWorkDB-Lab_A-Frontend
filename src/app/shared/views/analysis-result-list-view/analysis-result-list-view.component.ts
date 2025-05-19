import { Component, OnInit } from '@angular/core';
import { GenericListViewComponent } from '../../generics/generic-list-view/generic-list-view.component';
import { AnalysisResultViewComponent } from '../analysis-result-view/analysis-result-view.component';
import { AnalysisResult } from '../../../data/models/analysis-result';
import { AnalysisResultService } from '../../../data/services/analysis-result.service';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';
import { DatetimeFilterComponent } from '../../filters/datetime-filter/datetime-filter.component';
import { AnalysisCenterService } from '../../../data/services/analysis-center.service';
import { AnalysisService } from '../../../data/services/analysis.service';
import { AnalysisCenter } from '../../../data/models/analysis-center';
import { Analysis } from '../../../data/models/analysis';
import { SelectFilterComponent } from '../../filters/select-filter/select-filter.component';
import {AnalysisResultFilter} from '../../../data/filters/analysis-result-filter';
import {FilterItem} from '../../../data/helpers/filter-item';

@Component({
  selector: 'app-analysis-result-list-view',
  imports: [GenericListViewComponent,
    AnalysisResultViewComponent,
    MatGridList,
    MatGridTile,
    MatButton,
    DatetimeFilterComponent,
    SelectFilterComponent],
  templateUrl: './analysis-result-list-view.component.html',
  styleUrl: './analysis-result-list-view.component.css',
  standalone: true
})
export class AnalysisResultListViewComponent implements OnInit{
  // Configuration for generic list
  pageName: string = 'Результати Аналізів';
  searchPlaceholder: string = 'Пошук за клієнтом';
  filtersTitle: string = 'Фільтри';
  emptyListMessage: string = 'Результатів не знайдено';
  cols: number = 2; // default

  // Data
  analysisResults: AnalysisResult[] = [];
  groupedResults: {orderId: number, orderNumber: number, results: AnalysisResult[]}[] = [];
  analysisCenters: AnalysisCenter[] = [];
  analyses: Analysis[] = [];
  isLoading = false;
  ifBeginLoading = true;
  hasMore = true;

  // Filter
  searchTerm: string = '';
  dateRange: [Date | null, Date | null] = [null, null];
  filter: AnalysisResultFilter = {
    pageNumber: 1,
    pageSize: 48,
    fromDate: undefined,
    toDate: undefined,
    analysisCenterId: undefined,
    analysisId: undefined,
    clientFullname: '',
  };

  constructor(
    private analysisResultService: AnalysisResultService,
    private analysisCenterService: AnalysisCenterService,
    private analysisService: AnalysisService
  ) {}

  ngOnInit() {
    this.updateGridCols();
    window.addEventListener('resize', this.updateGridCols.bind(this));
    this.loadAnalysisCenters();
    this.loadAnalyses();
    this.loadAnalysisResults();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateGridCols.bind(this));
  }

  updateGridCols() {
    if (window.innerWidth < 1500) {
      this.cols = 1;
    } else if (window.innerWidth > 2200) {
      this.cols = 3;
    } else {
      this.cols = 2;
    }
  }

  loadAnalysisResults() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.analysisResultService.getAnalysisResults(
      this.filter
    ).subscribe({
      next: (results) => {
        this.analysisResults = [...this.analysisResults, ...results];
        this.groupResultsByOrder();
        this.hasMore = results.length === this.filter.pageSize;
        this.isLoading = false;
        if (this.ifBeginLoading) {
          this.ifBeginLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading analysis results:', err);
        this.isLoading = false;
      }
    });
  }

  groupResultsByOrder() {
    const orderMap = new Map<number, {orderId: number, orderNumber: number, results: AnalysisResult[]}>();

    this.analysisResults.forEach(result => {
      if (!result.orderAnalysis.clientOrder.number) return;

      const orderId = result.orderAnalysis.clientOrder.clientOrderId;
      if (!orderMap.has(orderId)) {
        orderMap.set(orderId, {
          orderId: orderId,
          orderNumber: result.orderAnalysis.clientOrder.number,
          results: []
        });
      }
      orderMap.get(orderId)!.results.push(result);
    });

    this.groupedResults = Array.from(orderMap.values());
  }

  loadMore() {
    if (this.hasMore && !this.isLoading) {
      this.filter.pageNumber++;
      this.loadAnalysisResults();
    }
  }

  loadAnalysisCenters() {
    this.analysisCenterService.getAnalysisCenters().subscribe({
      next: (centers) => {
        this.analysisCenters = centers;
      },
      error: (err) => {
        console.error('Error loading analysis centers:', err);
      }
    });
  }

  loadAnalyses() {
    this.analysisService.getAllAnalyses().subscribe({
      next: (analyses) => {
        this.analyses = analyses;
      },
      error: (err) => {
        console.error('Error loading analyses:', err);
      }
    });
  }

  get analysisCenterItems(): FilterItem[] {
    return this.analysisCenters.map(c => ({
      id: c.analysisCenterId,
      name: `${c.city.cityName}, ${c.address}`
    }));
  }

  get analysisItems(): FilterItem[] {
    return this.analyses.map(a => ({
      id: a.analysisId,
      name: a.name
    }));
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.filter. clientFullname = searchTerm;
    this.applyFilters();
  }

  trackByAnalysisResultId(index: number, item: AnalysisResult) {
    return item.analysisResultId;
  }

  applyFilters() {
    this.analysisResults = [];
    this.ifBeginLoading = true;

    this.filter.pageNumber = 1;
    this.filter.fromDate = this.dateRange[0] == null ? undefined : this.dateRange[0]!;
    this.filter.toDate = this.dateRange[1] == null ? undefined : this.dateRange[1]!;

    this.loadAnalysisResults();
  }

  toggleAnalysisCenter(centerId: number | string | null) {
    this.filter.analysisCenterId = centerId === null ? undefined : Number(centerId);
    this.applyFilters();
  }

  toggleAnalysis(analysisId: number | string | null) {
    this.filter.analysisId = analysisId === null ? undefined : Number(analysisId);
    this.applyFilters();
  }
}
