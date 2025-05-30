import { Component, OnInit } from '@angular/core';
import { GenericListViewComponent } from '../../../generics/generic-list-view/generic-list-view.component';
import { OrderViewComponent } from '../../model-view/order-view/order-view.component';
import { ClientOrder } from '../../../../data/models/client-order';
import { ClientOrderService } from '../../../../data/services/client-order.service';
import { ClientOrderFilter } from '../../../../data/filters/client-order-filter';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import {MatButton} from '@angular/material/button';
import {PriceFilterComponent} from '../../../filters/price-filter/price-filter.component';
import {StatusService} from '../../../../data/services/status.service';
import {Status} from '../../../../data/models/status';
import {DatetimeFilterComponent} from '../../../filters/datetime-filter/datetime-filter.component';
import {Employee} from '../../../../data/models/employee';
import {EmployeeService} from '../../../../data/services/employee.service';
import {SelectFilterComponent} from '../../../filters/select-filter/select-filter.component';
import {TypeFilterComponent} from '../../../filters/type-filter/type-filter.component';
import {EmployeeFilter} from '../../../../data/filters/employee-filter';
import {FilterItem} from '../../../../data/helpers/filter-item';
import {ClientOrderCreateViewComponent} from '../../../../cashier/client-order-create-view/client-order-create-view.component';

@Component({
  selector: 'app-order-list-view',
  imports: [
    GenericListViewComponent,
    OrderViewComponent,
    MatGridList,
    MatGridTile,
    MatButton,
    PriceFilterComponent,
    DatetimeFilterComponent,
    SelectFilterComponent,
    TypeFilterComponent,
    ClientOrderCreateViewComponent
  ],
  templateUrl: './order-list-view.component.html',
  styleUrl: './order-list-view.component.css',
  standalone: true
})
export class OrderListViewComponent implements OnInit {
  // Configuration for generic list
  pageName: string = 'Клієнтські Замовлення';
  searchPlaceholder: string = 'Пошук за клієнтом';
  filtersTitle: string = 'Фільтри';
  emptyListMessage: string = 'Замовленнь не знайдено';
  cols: number = 2; // default

  // Data
  orders: ClientOrder[] = [];
  statuses: Status[] = [];
  employees: Employee[] = [];
  isLoading = false;
  ifBeginLoading = true;
  hasMore = true;

  // Filter
  filter: ClientOrderFilter = {
    pageNumber: 1,
    pageSize: 48,
    fromDate: undefined,
    toDate: undefined,
    employeeId: undefined,
    clientFullname: '',
    minPrice: 0,
    maxPrice: 5000,
    statusIds: [1, 2, 3, 4]
  };

  // Filtered price
  minPrice: number = 0;
  maxPrice: number = 5000;
  priceRange: [number, number] = [0, 5000];
  searchTerm: string = '';
  selectedStatuses: number[] = [1, 2, 3, 4];
  allStatusesSelected: boolean = true;
  someStatusesSelected: boolean = false;
  dateRange: [Date | null, Date | null] = [null, null];
  step: number = 10;

  get statusItems(): FilterItem[] {
    return this.statuses.map(s => ({
      id: s.statusId,
      name: s.statusName
    }));
  }

  get employeeItems(): FilterItem[] {
    return this.employees.map(e => ({
      id: e.employeeId,
      name: `${e.firstName} ${e.lastName}`
    }));
  }

  constructor(
    private orderService: ClientOrderService,
    private statusService: StatusService,
    private employeeService: EmployeeService) {}

  ngOnInit() {
    this.updateGridCols();
    window.addEventListener('resize', this.updateGridCols.bind(this));
    this.loadStatuses();
    this.loadEmployees();
    this.loadOrders();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateGridCols.bind(this));
  }

  updateGridCols() {
    if(window.innerWidth < 1500) {
      this.cols = 1;
    }
    else if(window.innerWidth > 2200) {
      this.cols = 3;
    }
    else {
      this.cols = 2;
    }
  }

  loadOrders() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.orderService.getClientOrders(this.filter).subscribe({
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
      },
      error: (err) => {
        console.error('Error loading statuses:', err);
      }
    });
  }

  loadEmployees() {
    const filter: EmployeeFilter = {
      search: undefined,
      laboratoryId: undefined,
      positionIds: undefined,
      pageNumber: 1,
      pageSize: 10
    };

    this.employeeService.getEmployees(filter).subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }
  loadFilteredOrders() {
    this.isLoading = true;
    this.orderService.getClientOrders(this.filter).subscribe({
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
    this.filter.clientFullname = searchTerm;
    this.filter.pageNumber = 1;
    this.orders = [];
    this.applyFilters();
  }

  trackByOrderId(index: number, item: ClientOrder) {
    return item.clientOrderId;
  }

  applyFilters() {
    // Reset the page number to 1 and clear the orders array
    this.filter.pageNumber = 1;
    this.ifBeginLoading = true;
    this.orders = [];
    this.filter.minPrice = this.priceRange[0];
    this.filter.maxPrice = this.priceRange[1];

    // Update the date range in the filter
    this.filter.fromDate = this.dateRange[0] == null ? undefined : this.dateRange[0]!;
    this.filter.toDate = this.dateRange[1] == null ? undefined : this.dateRange[1]!;

    // Load the orders again with the new filter
   this.loadFilteredOrders();
  }

  toggleStatuses(statusId: number) {
    const index = this.selectedStatuses.indexOf(statusId);
    if (index === -1) {
      this.selectedStatuses.push(statusId);
    } else {
      this.selectedStatuses.splice(index, 1);
    }
    this.updateStatusSelectionState();
    this.filter.statusIds = this.selectedStatuses.length > 0 ? this.selectedStatuses : undefined;
    this.applyFilters();
  }

  updateStatusSelectionState() {
    const numSelected = this.selectedStatuses.length;
    this.allStatusesSelected = numSelected === this.statuses.length;
    this.someStatusesSelected = numSelected > 0 && !this.allStatusesSelected;
  }

  toggleEmployee($event: number | string | null) {
    this.filter.employeeId = $event === null ? undefined : Number($event);
    this.applyFilters();
  }
}
