import { Component, OnInit } from '@angular/core';
import { GenericListViewComponent } from '../../generics/generic-list-view/generic-list-view.component';
import { BiomaterialDeliveryViewComponent } from '../biomaterial-delivery-view/biomaterial-delivery-view.component';
import { BiomaterialDelivery } from '../../../data/models/biomaterial-delivery';
import { BiomaterialDeliveryService } from '../../../data/services/biomaterial-delivery.service';
import { BiomaterialDeliveryFilter } from '../../../data/filters/biomaterial-delivery-filter';
import { StatusService } from '../../../data/services/status.service';
import { Status } from '../../../data/models/status';
import { AnalysisCenterService } from '../../../data/services/analysis-center.service';
import { AnalysisCenter } from '../../../data/models/analysis-center';
import { FilterItem } from '../../../data/helpers/filter-item';
import { MatButton } from '@angular/material/button';
import { SelectFilterComponent } from '../../filters/select-filter/select-filter.component';
import { TypeFilterComponent } from '../../filters/type-filter/type-filter.component';
import { DatetimeFilterComponent } from '../../filters/datetime-filter/datetime-filter.component';
import {BiomaterialCollectionViewComponent} from "../biomaterial-collection-view/biomaterial-collection-view.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

@Component({
  selector: 'app-biomaterial-delivery-list-view',
    imports: [
        GenericListViewComponent,
        BiomaterialDeliveryViewComponent,
        MatButton,
        SelectFilterComponent,
        TypeFilterComponent,
        DatetimeFilterComponent,
        BiomaterialCollectionViewComponent,
        MatGridList,
        MatGridTile
    ],
  templateUrl: './biomaterial-delivery-list-view.component.html',
  styleUrl: './biomaterial-delivery-list-view.component.css',
  standalone: true
})
export class BiomaterialDeliveryListViewComponent implements OnInit {
  // Configuration for generic list
  pageName: string = 'Доставки біоматеріалів';
  filtersTitle: string = 'Фільтри';
  emptyListMessage: string = 'Доставок не знайдено';

  // Data
  deliveries: BiomaterialDelivery[] = [];
  statuses: Status[] = [];
  analysisCenters: AnalysisCenter[] = [];
  isLoading = false;
  ifBeginLoading = true;
  hasMore = true;

  // Filter
  filter: BiomaterialDeliveryFilter = {
    pageNumber: 1,
    pageSize: 48,
    analysisCenterId: undefined,
    fromDate: undefined,
    toDate: undefined,
    statusId: undefined
  };

  // Filter state
  dateRange: [Date | null, Date | null] = [null, null];
  selectedStatuses: number[] = [];
  cols: number = 2;

  updateGridCols() {
    if (window.innerWidth < 1800) {
      this.cols = 1;
    } else if (window.innerWidth > 2800) {
      this.cols = 4;
    } else if (window.innerWidth > 2100) {
      this.cols = 3;
    } else {
      this.cols = 2;
    }
  }


  get statusItems(): FilterItem[] {
    return this.statuses.map(s => ({
      id: s.statusId,
      name: s.statusName
    }));
  }

  get analysisCenterItems(): FilterItem[] {
    return this.analysisCenters.map(ac => ({
      id: ac.analysisCenterId,
      name: `${ac.address}, ${ac.city.cityName}`
    }));
  }

  constructor(
    private deliveryService: BiomaterialDeliveryService,
    private statusService: StatusService,
    private analysisCenterService: AnalysisCenterService
  ) {}

  ngOnInit() {
    this.loadStatuses();
    window.addEventListener('resize', this.updateGridCols.bind(this));
  }

  loadDeliveries() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.deliveryService.getBiomaterialDeliveries(this.filter).subscribe({
      next: (newDeliveries) => {
        this.deliveries = [...this.deliveries, ...newDeliveries];
        this.hasMore = newDeliveries.length === this.filter.pageSize;
        this.isLoading = false;
        if (this.ifBeginLoading) {
          this.ifBeginLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading deliveries:', err);
        this.isLoading = false;
      }
    });
  }

  loadStatuses() {
    this.statusService.getStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses;
        this.loadAnalysisCenters();
      },
      error: (err) => {
        console.error('Error loading statuses:', err);
      }
    });
  }

  loadAnalysisCenters() {
    this.analysisCenterService.getAnalysisCenters().subscribe({
      next: (centers) => {
        this.analysisCenters = centers;
        this.loadDeliveries();
      },
      error: (err) => {
        console.error('Error loading analysis centers:', err);
      }
    });
  }

  loadFilteredDeliveries() {
    this.isLoading = true;
    this.deliveryService.getBiomaterialDeliveries(this.filter).subscribe({
      next: (newDeliveries) => {
        this.deliveries = [...newDeliveries];
        this.hasMore = newDeliveries.length === this.filter.pageSize;
        this.isLoading = false;
        if (this.ifBeginLoading) {
          this.ifBeginLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading deliveries:', err);
        this.isLoading = false;
      }
    });
  }

  loadMore() {
    if (this.hasMore && !this.isLoading) {
      this.filter.pageNumber++;
      this.loadDeliveries();
    }
  }

  onSearch(searchTerm: string) {
    this.filter.pageNumber = 1;
    this.deliveries = [];
    this.applyFilters();
  }

  trackByDeliveryId(index: number, item: BiomaterialDelivery) {
    return item.biomaterialDeliveryId;
  }

  applyFilters() {
    this.filter.pageNumber = 1;
    this.ifBeginLoading = true;
    this.deliveries = [];
    this.filter.fromDate = this.dateRange[0] ? new Date(this.dateRange[0]!) : undefined;
    this.filter.toDate = this.dateRange[1] ? new Date(this.dateRange[1]!) : undefined;
    this.loadFilteredDeliveries();
  }

  toggleStatuses(statusId: number) {
    this.filter.statusId = statusId;
    this.applyFilters();
  }

  toggleAnalysisCenter(centerId: number | string | null) {
    this.filter.analysisCenterId = centerId === null ? undefined : Number(centerId);
    this.applyFilters();
  }
}
