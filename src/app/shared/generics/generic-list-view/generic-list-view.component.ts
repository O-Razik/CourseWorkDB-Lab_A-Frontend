import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {JsonPipe, NgTemplateOutlet} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-generic-list-view',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgTemplateOutlet,
    JsonPipe,
    MatIcon
  ],
  templateUrl: './generic-list-view.component.html',
  styleUrl: './generic-list-view.component.css',
  standalone: true,
})
export class GenericListViewComponent<T> {
  // Required Inputs
  @Input() pageName: string = '';
  @Input() items: T[] = [];
  @Input() filterShown: boolean = true;

  // Configuration

  @Input() searchOn: boolean = true;
  @Input() searchPlaceholder: string = 'Пошук';
  @Input() searchTerm: string = '';
  @Input() filtersTitle: string = 'Фільтри';
  @Input() emptyListMessage: string = 'Нічого не знайдено';
  @Input() useLocalSearch: boolean = false;
  @Input() trackByFn: (index: number, item: T) => any = (index, _) => index;
  @Output() searchTermChange = new EventEmitter<string>();

  // Pagination
  @Input() paginator: boolean = false;
  @Input() pageSize: number = 10;
  @Input() totalItems: number = 0;
  @Output() pageChange = new EventEmitter<number>();


  // Create Item
  @Input() createButtonText: string = 'Створити';
  @Input() canCreate: boolean = false;
  @ContentChild('createTemplate') createTemplate?: TemplateRef<any>;
  showCreatePanel: boolean = false;

  searchIcon: string = 'svg/search.svg';
  currentPage: number = 1;
  paginatedItems: T[] = [];
  totalPages: number = 1;

  // Templates
  @ContentChild('itemListTemplate') itemListTemplate?: TemplateRef<any>;
  @ContentChild('filtersTemplate') filtersTemplate?: TemplateRef<any>;

  // State
  filteredItems: T[] = [];
  activeFilters: any = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] || changes['searchTerm']) {
      this.filterItems();
      this.updatePagination();
    }
    if (changes['totalItems']) {
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }
  }

  filterItems() {
    if (this.useLocalSearch && this.searchTerm) {
      // Local filtering if enabled
      this.filteredItems = this.items.filter(item =>
        JSON.stringify(item).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // No local filtering, just show the received items
      this.filteredItems = [...this.items];
    }
    this.totalItems = this.filteredItems.length;
    this.updatePagination();
  }

  updatePagination() {
    if (this.paginator) {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.paginatedItems = this.filteredItems.slice(startIndex, startIndex + this.pageSize);
      this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
    } else {
      this.paginatedItems = this.filteredItems;
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.searchTermChange.emit(this.searchTerm);
    this.filterItems();
  }

  openCreatePanel() {
    this.showCreatePanel = true;
    document.body.style.overflow = 'hidden';
  }

  closeCreatePanel() {
    this.showCreatePanel = false;
    document.body.style.overflow = '';
  }
}
