import {Component, OnInit} from '@angular/core';
import {Employee} from '../../../data/models/employee';
import {Laboratory} from '../../../data/models/laboratory';
import {EmployeeFilter} from '../../../data/filters/employee-filter';
import {GenericListViewComponent} from '../../generics/generic-list-view/generic-list-view.component';
import {EmployeeViewComponent} from '../employee-view/employee-view.component';
import {Position} from '../../../data/models/position';
import {EmployeeService} from '../../../data/services/employee.service';
import {LaboratoryService} from '../../../data/services/laboratory.service';
import {SelectFilterComponent} from '../../filters/select-filter/select-filter.component';
import {MatButton} from '@angular/material/button';
import {TypeFilterComponent} from '../../filters/type-filter/type-filter.component';
import {CityService} from '../../../data/services/city.service';
import {City} from '../../../data/models/city';
import {FilterItem} from '../../../data/helpers/filter-item';

@Component({
  selector: 'app-employee-list-view',
  imports: [
    GenericListViewComponent,
    EmployeeViewComponent,
    MatButton,
    TypeFilterComponent,
    SelectFilterComponent
  ],
  templateUrl: './employee-list-view.component.html',
  styleUrl: './employee-list-view.component.css',
  standalone: true,
})
export class EmployeeListViewComponent implements OnInit {

  // Configuration for generic list
  pageName: string = 'Співробітники';
  searchPlaceholder: string = 'Пошук за співробітником';
  filtersTitle: string = 'Фільтри';
  emptyListMessage: string = 'Співробітників не знайдено';

  // Data
  employees: Employee[] = [];
  laboratories: Laboratory[] = [];
  cities: City[] = [];
  positions: Position[] = [];

  // Filters
  filter: EmployeeFilter = {
    pageNumber: 1,
    pageSize: 50,
    search: undefined,
    laboratoryId: undefined,
    positionIds: [1,2,3,4]
  };
  selectedCity?: number = undefined;
  cityLaboratories: Laboratory[] = [];
  selectedPositions: number[] = [1,2,3,4];
  allPositionsSelected: boolean = true;
  somePositionsSelected: boolean = false;
  searchTerm: string = '';

  // Loading state
  isLoading = false;
  ifBeginLoading = true;

  // Pagination
  hasMore = true;

  // Getters
  get laboratoryItems(): FilterItem[] {
    return this.cityLaboratories.map(laboratory => ({
      id: laboratory.laboratoryId,
      name: laboratory.city.cityName + ' ' + laboratory.address
    }));
  }

  get positionItems(): FilterItem[] {
    return this.positions.map(position => ({
      id: position.positionId,
      name: position.positionName
    }));
  }

  get cityItems(): FilterItem[] {
    return this.cities.map(city => ({
      id: city.cityId,
      name: city.cityName
    }));
  }

  // Constructor
  constructor(
    private employeeService: EmployeeService,
    private laboratoryService: LaboratoryService,
    private cityService: CityService,
  ) {
    // Initialize the component
  }

  // Lifecycle hooks
  ngOnInit() {
    this.loadCities();
    this.loadLaboratories();
    this.loadPositions();
    this.loadEmployees();
  }

  // Load data methods
  loadEmployees() {
    this.isLoading = true;
    this.employeeService.getEmployees(this.filter).subscribe({
      next: (newEmployees) => {
        this.employees = [...this.employees, ...newEmployees];
        this.hasMore = newEmployees.length === this.filter.pageSize;
        this.isLoading = false;
        if (this.ifBeginLoading) {
          this.ifBeginLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.ifBeginLoading = false;
      }
    });
  }

  loadLaboratories() {
    this.laboratoryService.getLaboratories().subscribe({
      next: (laboratories) => {
        this.laboratories = laboratories;
        // Update cityLaboratories when labs load
        this.cityLaboratories = [...laboratories];
      },
      error: (error) => {
        console.error('Error loading laboratories:', error);
      }
    });
  }

  loadPositions() {
    this.employeeService.getPositions().subscribe({
    next: (positions) => {
         this.positions = positions;
       },
       error: (error) => {
        console.error('Error loading positions:', error);
       }
    });
  }

  loadCities() {
    this.cityService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
        // Initialize cityLaboratories with all labs when cities load
        this.cityLaboratories = [...this.laboratories];
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  loadMore() {
    if (this.hasMore && !this.isLoading) {
      this.filter.pageNumber++;
      this.loadEmployees();
    }
  }

  onSearch(searchTerm: string) {
    this.filter.search = searchTerm;
    this.filter.pageNumber = 1;
    this.employees = [];
    this.loadEmployees();
  }

  trackByEmployeeId(index: number, employee: Employee): number {
    return employee.employeeId;
  }

  applyFilters() {
    this.filter.pageNumber = 1;
    this.employees = [];
    this.loadEmployees();
  }

  togglePositions(positionId: number) {
    const index = this.selectedPositions.indexOf(positionId);
    if (index > -1) {
      this.selectedPositions.splice(index, 1);
    } else {
      this.selectedPositions.push(positionId);
    }
    this.updatePositionSelectionState();
    this.filter.positionIds = this.selectedPositions.length > 0 ? this.selectedPositions : undefined;
    this.applyFilters();
  }

  updatePositionSelectionState() {
    this.allPositionsSelected = this.selectedPositions.length === this.positionItems.length;
    this.somePositionsSelected = this.selectedPositions.length > 0 && !this.allPositionsSelected;
  }

  toggleCities($event: number | string | null) {
    this.selectedCity = $event === null ? undefined : Number($event);
    if (this.selectedCity) {
      this.cityLaboratories = this.laboratories.filter(lab => lab.cityId === this.selectedCity);
    } else {
      this.cityLaboratories = [...this.laboratories]; // Create a new array reference
    }
    this.filter.laboratoryId = undefined; // Reset lab filter when city changes
    this.applyFilters();
  }

  toggleLaboratories($event: number | string | null) {
    this.filter.laboratoryId = $event === null ? undefined : Number($event);
    this.applyFilters();
  }
}
