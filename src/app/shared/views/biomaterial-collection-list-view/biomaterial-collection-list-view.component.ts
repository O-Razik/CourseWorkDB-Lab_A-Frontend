import { Component, OnInit } from '@angular/core';
import { BiomaterialCollection } from '../../../data/models/biomaterial-collection';
import { BiomaterialCollectionService } from '../../../data/services/biomaterial-collection.service';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatButton } from '@angular/material/button';
import { DatetimeFilterComponent } from '../../filters/datetime-filter/datetime-filter.component';
import { LaboratoryService } from '../../../data/services/laboratory.service';
import { BiomaterialService } from '../../../data/services/biomaterial.service';
import { InventoryService } from '../../../data/services/inventory.service';
import { Laboratory } from '../../../data/models/laboratory';
import { Biomaterial } from '../../../data/models/biomaterial';
import { Inventory } from '../../../data/models/inventory';
import { SelectFilterComponent } from '../../filters/select-filter/select-filter.component';
import { BiomaterialCollectionFilter } from '../../../data/filters/biomaterial-collection-filter';
import { FilterItem } from '../../../data/helpers/filter-item';
import { GenericListViewComponent } from '../../generics/generic-list-view/generic-list-view.component';
import { BiomaterialCollectionViewComponent } from '../biomaterial-collection-view/biomaterial-collection-view.component';

@Component({
  selector: 'app-biomaterial-collection-list-view',
  imports: [
    GenericListViewComponent,
    BiomaterialCollectionViewComponent,
    MatGridList,
    MatGridTile,
    MatButton,
    DatetimeFilterComponent,
    SelectFilterComponent
  ],
  templateUrl: './biomaterial-collection-list-view.component.html',
  styleUrls: ['./biomaterial-collection-list-view.component.css'],
  standalone: true
})
export class BiomaterialCollectionListViewComponent implements OnInit {
  // Configuration for generic list
  pageName: string = 'Збори біоматеріалів';
  searchPlaceholder: string = 'Пошук за номером замовлення';
  filtersTitle: string = 'Фільтри';
  emptyListMessage: string = 'Зборів не знайдено';
  cols: number = 2; // default

  // Data
  biomaterialCollections: BiomaterialCollection[] = [];
  groupedCollections: {orderId: number, orderNumber: number, collections: BiomaterialCollection[]}[] = [];
  laboratories: Laboratory[] = [];
  biomaterials: Biomaterial[] = [];
  inventories: Inventory[] = [];
  isLoading = false;
  ifBeginLoading = true;
  hasMore = true;

  // Filter
  searchTerm: string = '';
  filter: BiomaterialCollectionFilter = {
    pageNumber: 1,
    pageSize: 48,
    fromCollectionDate: undefined,
    toCollectionDate: undefined,
    fromExpirationDate: undefined,
    toExpirationDate: undefined,
    laboratoryId: undefined,
    biomaterialId: undefined,
    inventoryId: undefined,
    search: ''
  };

  // Date ranges for both filters
  collectionDateRange: [Date | null, Date | null] = [null, null];
  expirationDateRange: [Date | null, Date | null] = [null, null];

  constructor(
    private biomaterialCollectionService: BiomaterialCollectionService,
    private laboratoryService: LaboratoryService,
    private biomaterialService: BiomaterialService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.updateGridCols();
    window.addEventListener('resize', this.updateGridCols.bind(this));
    this.loadLaboratories();
    this.loadBiomaterials();
    this.loadInventories();
    this.loadBiomaterialCollections();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateGridCols.bind(this));
  }

  updateGridCols() {
    if (window.innerWidth < 1500) {
      this.cols = 1;
    } else if (window.innerWidth > 2800) {
      this.cols = 4;
    } else if (window.innerWidth > 2100) {
      this.cols = 3;
    } else {
      this.cols = 2;
    }
  }

  loadBiomaterialCollections() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.biomaterialCollectionService.getBiomaterialCollections(this.filter).subscribe({
      next: (collections) => {
        this.biomaterialCollections = [...this.biomaterialCollections, ...collections];
        this.groupCollectionsByOrder();
        this.hasMore = collections.length === this.filter.pageSize;
        this.isLoading = false;
        if (this.ifBeginLoading) {
          this.ifBeginLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading biomaterial collections:', err);
        this.isLoading = false;
      }
    });
  }

  groupCollectionsByOrder() {
    const orderMap = new Map<number, {orderId: number, orderNumber: number, collections: BiomaterialCollection[]}>();

    this.biomaterialCollections.forEach(collection => {
      const orderId = collection.clientOrderId;
      const orderNumber = collection.clientOrderNumber || orderId;

      if (!orderMap.has(orderId)) {
        orderMap.set(orderId, {
          orderId: orderId,
          orderNumber: orderNumber,
          collections: []
        });
      }
      orderMap.get(orderId)!.collections.push(collection);
    });

    this.groupedCollections = Array.from(orderMap.values());
  }

  loadMore() {
    if (this.hasMore && !this.isLoading) {
      this.filter.pageNumber++;
      this.loadBiomaterialCollections();
    }
  }

  loadLaboratories() {
    this.laboratoryService.getLaboratories().subscribe({
      next: (laboratories) => {
        this.laboratories = laboratories;
      },
      error: (err) => {
        console.error('Error loading laboratories:', err);
      }
    });
  }

  loadBiomaterials() {
    this.biomaterialService.getAllBiomaterials().subscribe({
      next: (biomaterials) => {
        this.biomaterials = biomaterials;
      },
      error: (err) => {
        console.error('Error loading biomaterials:', err);
      }
    });
  }

  loadInventories() {
    this.inventoryService.getAllInventories().subscribe({
      next: (inventories) => {
        this.inventories = inventories;
      },
      error: (err) => {
        console.error('Error loading inventories:', err);
      }
    });
  }

  get laboratoryItems(): FilterItem[] {
    return this.laboratories.map(l => ({
      id: l.laboratoryId,
      name: l.city.cityName + ', ' + l.address
    }));
  }

  get biomaterialItems(): FilterItem[] {
    return this.biomaterials.map(b => ({
      id: b.biomaterialId,
      name: b.biomaterialName
    }));
  }

  get inventoryItems(): FilterItem[] {
    return this.inventories.map(i => ({
      id: i.inventoryId,
      name: i.inventoryName
    }));
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.filter.search = searchTerm;
    this.applyFilters();
  }

  trackByBiomaterialCollectionId(index: number, item: BiomaterialCollection) {
    return item.biomaterialCollectionId;
  }

  applyFilters() {
    this.biomaterialCollections = [];
    this.ifBeginLoading = true;

    this.filter.pageNumber = 1;

    // Update collection date filters
    this.filter.fromCollectionDate = this.collectionDateRange[0] ?? undefined;
    this.filter.toCollectionDate = this.collectionDateRange[1] ?? undefined;

    // Update expiration date filters
    this.filter.fromExpirationDate = this.expirationDateRange[0] ?? undefined;
    this.filter.toExpirationDate = this.expirationDateRange[1] ?? undefined;

    this.loadBiomaterialCollections();
  }

  toggleLaboratory(laboratoryId: number | string | null) {
    this.filter.laboratoryId = laboratoryId === null ? undefined : Number(laboratoryId);
    this.applyFilters();
  }

  toggleBiomaterial(biomaterialId: number | string | null) {
    this.filter.biomaterialId = biomaterialId === null ? undefined : Number(biomaterialId);
    this.applyFilters();
  }

  toggleInventory(inventoryId: number | string | null) {
    this.filter.inventoryId = inventoryId === null ? undefined : Number(inventoryId);
    this.applyFilters();
  }
}
