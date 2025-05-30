import { Component, OnInit } from '@angular/core';
import { GenericListViewComponent } from '../../../generics/generic-list-view/generic-list-view.component';
import { InventoryOrderViewComponent } from '../../model-view/inventory-order-view/inventory-order-view.component';
import { InventoryOrder } from '../../../../data/models/inventory-order';
import { InventoryOrderService } from '../../../../data/services/inventory-order.service';
import { InventoryOrderFilter } from '../../../../data/filters/inventory-order-filter';
import { MatButton } from '@angular/material/button';
import { PriceFilterComponent } from '../../../filters/price-filter/price-filter.component';
import { StatusService } from '../../../../data/services/status.service';
import { Status } from '../../../../data/models/status';
import { DatetimeFilterComponent } from '../../../filters/datetime-filter/datetime-filter.component';
import { Supplier } from '../../../../data/models/supplier';
import { SupplierService } from '../../../../data/services/supplier.service';
import { SelectFilterComponent } from '../../../filters/select-filter/select-filter.component';
import { TypeFilterComponent } from '../../../filters/type-filter/type-filter.component';
import {FilterItem} from '../../../../data/helpers/filter-item';
import {InventoryOrderCreateViewComponent} from '../../../../i-manager/inventory-order-create-view/inventory-order-create-view.component';

@Component({
  selector: 'app-inventory-order-list-view',
  imports: [
    GenericListViewComponent,
    InventoryOrderViewComponent,
    MatButton,
    PriceFilterComponent,
    DatetimeFilterComponent,
    SelectFilterComponent,
    TypeFilterComponent,
    InventoryOrderCreateViewComponent
  ],
  templateUrl: './inventory-order-list-view.component.html',
  styleUrl: './inventory-order-list-view.component.css',
  standalone: true
})
export class InventoryOrderListViewComponent implements OnInit {
  // Configuration for generic list
  pageName: string = 'Замовлення Інвентарю';
  searchPlaceholder: string = 'Пошук за номером або постачальником';
  filtersTitle: string = 'Фільтри';
  emptyListMessage: string = 'Замовлень не знайдено';

  // Data
  orders: InventoryOrder[] = [];
  statuses: Status[] = [];
  suppliers: Supplier[] = [];
  isLoading = false;
  ifBeginLoading = true;
  hasMore = true;

  // Filter
  filter: InventoryOrderFilter = {
    pageNumber: 1,
    pageSize: 48,
    fromDate: undefined,
    toDate: undefined,
    supplierId: undefined,
    minPrice: 0,
    maxPrice: 50000,
    statusIds: undefined,
    search: ''
  };

  // Filter state
  minPrice: number = 0;
  maxPrice: number = 50000;
  priceRange: [number, number] = [0, 50000];
  searchTerm: string = '';
  selectedStatuses: number[] = [1,2,3,4];
  dateRange: [Date | null, Date | null] = [null, null];
  step: number = 100;

  get statusItems(): FilterItem[] {
    return this.statuses.map(s => ({
      id: s.statusId,
      name: s.statusName
    }));
  }

  get supplierItems(): FilterItem[] {
    return this.suppliers.map(s => ({
      id: s.supplierId,
      name: s.name
    }));
  }

  constructor(
    private orderService: InventoryOrderService,
    private statusService: StatusService,
    private supplierService: SupplierService
  ) {}

  ngOnInit() {
    this.loadStatuses();
  }

  loadOrders() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.orderService.getAllInventoryOrders(this.filter).subscribe({
      next: (newOrders) => {
        this.orders = [...this.orders, ...newOrders];

        this.hasMore = newOrders.length === this.filter.pageSize;
        this.isLoading = false;
        if (this.ifBeginLoading) {
          this.ifBeginLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      }
    });
  }

  loadStatuses() {
    this.statusService.getStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses;
        this.loadSuppliers();
      },
      error: (err) => {
        console.error('Error loading statuses:', err);
      }
    });
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error loading suppliers:', err);
      }
    });
  }

  loadFilteredOrders() {
    this.isLoading = true;
    this.orderService.getAllInventoryOrders(this.filter).subscribe({
      next: (newOrders) => {
        this.orders = [...newOrders];
        this.hasMore = newOrders.length === this.filter.pageSize;
        this.isLoading = false;
        if (this.ifBeginLoading) {
          this.ifBeginLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      }
    });
  }

  loadMore() {
    if (this.hasMore && !this.isLoading) {
      this.filter.pageNumber++;
      this.loadOrders();
    }
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.filter.search = searchTerm;
    this.filter.pageNumber = 1;
    this.orders = [];
    this.applyFilters();
  }

  trackByOrderId(index: number, item: InventoryOrder) {
    return item.inventoryOrderId;
  }

  applyFilters() {
    this.filter.pageNumber = 1;
    this.ifBeginLoading = true;
    this.orders = [];
    this.filter.minPrice = this.priceRange[0];
    this.filter.maxPrice = this.priceRange[1];
    this.filter.fromDate = this.dateRange[0] ? new Date(this.dateRange[0]!) : undefined;
    this.filter.toDate = this.dateRange[1] ? new Date(this.dateRange[1]!) : undefined;
    this.loadFilteredOrders();
  }

  toggleStatuses(statusId: number) {
    const index = this.selectedStatuses.indexOf(statusId);
    if (index === -1) {
      this.selectedStatuses.push(statusId);
    } else {
      this.selectedStatuses.splice(index, 1);
    }
    this.filter.statusIds = this.selectedStatuses.length > 0 ? this.selectedStatuses : undefined;
    this.applyFilters();
  }

  toggleSupplier(supplierId: number | string | null) {
    this.filter.supplierId = supplierId === null ? undefined : Number(supplierId);
    this.applyFilters();
  }
}
