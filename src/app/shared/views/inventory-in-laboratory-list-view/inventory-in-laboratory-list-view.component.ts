import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GenericListViewComponent} from '../../generics/generic-list-view/generic-list-view.component';
import {InventoryGroupInLabViewComponent} from '../inventory-group-in-lab-view/inventory-group-in-lab-view.component';
import {InventoryInLaboratory} from '../../../data/models/inventory-in-laboratory';
import {InventoryInLaboratoryService} from '../../../data/services/inventory-in-laboratory.service';
import {InventoryInLaboratoryFilter} from '../../../data/filters/inventory-in-laboratory-filter';
import {Inventory} from '../../../data/models/inventory';
import {InventoryService} from '../../../data/services/inventory.service';
import {SelectFilterComponent} from '../../filters/select-filter/select-filter.component';
import {Laboratory} from '../../../data/models/laboratory';
import {LaboratoryService} from '../../../data/services/laboratory.service';
import {TypeFilterComponent} from '../../filters/type-filter/type-filter.component';
import {DatetimeFilterComponent} from '../../filters/datetime-filter/datetime-filter.component';
import {FilterItem} from '../../../data/helpers/filter-item';
import {AuthService} from '../../../data/services/auth.service';
import {UserRole} from '../../../data/models/user-role';

@Component({
  selector: 'app-inventory-in-laboratory-list-view',
  imports: [
    GenericListViewComponent,
    InventoryGroupInLabViewComponent,
    TypeFilterComponent,
    SelectFilterComponent,
    DatetimeFilterComponent,
  ],
  templateUrl: './inventory-in-laboratory-list-view.component.html',
  styleUrl: './inventory-in-laboratory-list-view.component.css',
  standalone: true
})
export class InventoryInLaboratoryListViewComponent implements OnInit {
  // Configuration for generic list
  pageName: string = 'Інвентар у лабораторіях';
  searchPlaceholder: string = 'Пошук за назвою інвентарю';
  filtersTitle: string = 'Фільтри';
  emptyListMessage: string = 'Інвентаря не знайдено';

  // Data
  laboratories: Laboratory[] = [];
  inventories: Inventory[] = [];

  inventoryDirectory: {
    laboratory: Laboratory;
    inventories: {
      inventory: Inventory;
      items: InventoryInLaboratory[];
    }[];
  }[] = [];


  isLoading = false;
  ifBeginLoading = true;

  // Filter
  filter: InventoryInLaboratoryFilter = {
    fromDate: undefined,
    toDate: undefined,
    inventoryIds: [],
    laboratoryId: undefined,
    search: ''
  };

  // Filter state
  searchTerm: string = '';
  dateRange: [Date | null, Date | null] = [null, null];
  selectedInventories: number[] = [];
  @Input() filterShown!: boolean;
  isAdmin: boolean = false;

  @Input() selectedInventoryId: number | null = null;
  @Output() inventorySelected = new EventEmitter<InventoryInLaboratory>();

  onInventoryItemSelected(item: InventoryInLaboratory) {
    this.inventorySelected.emit(item);
  }

  getInventory() : FilterItem[] {
    return this.inventories.map(i => ({
      id: i.inventoryId,
      name: i.inventoryName
    }));
  }

  getLaboratories() : FilterItem[] {
    return this.laboratories.map(i => ({
      id: i.laboratoryId,
      name: i.city.cityName + ', ' + i.address
    }));
  }

  constructor(
    private authService: AuthService,
    private laboratoryService: LaboratoryService,
    private inventoryService: InventoryService,
    private inventoryInLaboratoryService: InventoryInLaboratoryService,
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.getCurrentUserRole() === UserRole.ADMIN;
    this.loadLaboratories();
  }

  loadLaboratories() {
    if(this.isAdmin) {
      this.laboratoryService.getLaboratories().subscribe({
        next: (laboratories) => {
          this.laboratories = laboratories;
          this.loadInventories();
        },
        error: (err) => {
          console.error('Error loading laboratories:', err);
        }
      });
    }
    else {
      this.laboratoryService.getLaboratoryById(this.authService.getCurrentEmployee()?.laboratoryId!).subscribe({
        next: (laboratory) => {
          this.laboratories = [laboratory];
          this.loadInventories();
        },
        error: (err) => {
          console.error('Error loading laboratories:', err);
        }
      });
    }
  }

  loadInventories() {
    this.inventoryService.getAllInventories().subscribe({
      next: (inventories) => {
        this.inventories = inventories;
        this.loadInventoryInLaboratory();
      },
      error: (err) => {
        console.error('Error loading inventories:', err);
      }
    });
  }

  loadInventoryInLaboratory() {
    this.ifBeginLoading = true;
    this.inventoryDirectory = [];
    this.selectedInventories = this.inventories.map(i => i.inventoryId);

    for (let i = 0; i < this.laboratories.length; i++) {
      this.inventoryInLaboratoryService.getInventoryByLaboratory(this.laboratories[i].laboratoryId, false).subscribe({
        next: (inventoryInLaboratories) => {
          this.pushToInventoryDirectory(this.laboratories[i], this.inventories, inventoryInLaboratories);
          this.ifBeginLoading = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading inventory in laboratory:', err);
          this.ifBeginLoading = false;
          this.isLoading = false;
        }
      });
    }
  }

  loadInventoryInLaboratoryByFilter() {
    if (this.filter.laboratoryId === undefined) {
      this.loadInventoryInLaboratory()
    }
    else {
      this.inventoryInLaboratoryService.getInventoryByLaboratory(this.filter.laboratoryId, false).subscribe({
        next: (inventoryInLaboratories) => {
          const inventories : Inventory[] = this.inventories.filter(i => this.selectedInventories.includes(i.inventoryId));
          this.pushToInventoryDirectory(this.laboratories[0], inventories, inventoryInLaboratories);
          this.ifBeginLoading = false;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading inventory in laboratory:', err);
          this.ifBeginLoading = false;
          this.isLoading = false;
        }
      });
    }
  }

  pushToInventoryDirectory(lab: Laboratory, inv: Inventory[], inventoryInLaboratories: InventoryInLaboratory[]) {
    this.inventoryDirectory.push({
      laboratory: lab,
      inventories: []
    });

    for (let i = 0; i < inv.length; i++) {
      let inventoryItems = inventoryInLaboratories.filter(item => item.inventoryId === inv[i].inventoryId);
      if (inventoryItems.length === 0) {
        continue;
      }

      if(this.filter.search) {
        const searchTerm = this.filter.search.toLowerCase();
        inventoryItems = inventoryItems.filter(item => item.inventory.inventoryName.toLowerCase().includes(searchTerm));
      }

      if(this.filter.fromDate){
        const fromDate = new Date(this.filter.fromDate);
        inventoryItems = inventoryItems.filter(item => new Date(item.expirationDate) >= fromDate);
      }

      if(this.filter.toDate){
        const toDate = new Date(this.filter.toDate);
        inventoryItems = inventoryItems.filter(item => new Date(item.expirationDate) <= toDate);
      }

      this.inventoryDirectory[this.inventoryDirectory.length - 1].inventories.push({
        inventory: inv[i],
        items: inventoryItems
      });
    }
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.filter.search = searchTerm;
    this.applyFilters();
  }

  trackByLabInventory(index: number, item: { laboratory: Laboratory; inventories: { inventory: Inventory; items: InventoryInLaboratory[] }[] }) {
    return item.laboratory.laboratoryId;
  }

  applyFilters() {
    this.ifBeginLoading = true;
    this.inventoryDirectory = [];
    this.loadInventoryInLaboratoryByFilter();
  }

  trackByInventoryGroup($index: number, group: {
    inventory: Inventory;
    items: InventoryInLaboratory[]
  }) {
    return group.inventory.inventoryId;
  }

  onInventorySelected(inventoryId: number) {
    const index = this.selectedInventories.indexOf(inventoryId);
    if (index === -1) {
      this.selectedInventories.push(inventoryId);
    } else {
      this.selectedInventories.splice(index, 1);
    }
    this.filter.inventoryIds = this.selectedInventories;
    this.applyFilters()
  }

  toggleLaboratories(laboratoryId: number | string | null) {
    if (laboratoryId === null) {
      this.filter.laboratoryId = undefined;
    } else {
      this.filter.laboratoryId = Number(laboratoryId);
    }
    this.applyFilters();
  }

  onDateRangeChange(dateRange: [Date | null, Date | null]) {
    this.dateRange = dateRange;
    this.filter.fromDate = dateRange[0] ? new Date(dateRange[0]!) : undefined;
    this.filter.toDate = dateRange[1] ? new Date(dateRange[1]!) : undefined;
    this.applyFilters();
  }
}
