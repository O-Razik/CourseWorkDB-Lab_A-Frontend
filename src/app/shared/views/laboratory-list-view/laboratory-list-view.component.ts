import {Component, OnInit} from '@angular/core';
import {Laboratory} from '../../../data/models/laboratory';
import {City} from '../../../data/models/city';
import {LaboratoryService} from '../../../data/services/laboratory.service';
import {CityService} from '../../../data/services/city.service';
import {GenericListViewComponent} from '../../generics/generic-list-view/generic-list-view.component';
import {LaboratoryViewComponent} from '../laboratory-view/laboratory-view.component';
import {TypeFilterComponent} from '../../filters/type-filter/type-filter.component';
import {ScheduleFilterComponent} from '../../filters/schedule-filter/schedule-filter.component';
import {Schedule} from '../../../data/models/schedule';
import {ScheduleService} from '../../../data/services/schedule.service';
import {AuthService} from '../../../data/services/auth.service';
import {UserRole} from '../../../data/models/user-role';

@Component({
  selector: 'app-laboratory-list-view',
  imports: [
    GenericListViewComponent,
    LaboratoryViewComponent,
    TypeFilterComponent,
    ScheduleFilterComponent
  ],
  templateUrl: './laboratory-list-view.component.html',
  styleUrl: './laboratory-list-view.component.css',
  standalone: true,
})
export class LaboratoryListViewComponent implements OnInit {

  // Configuration for generic list
  pageName: string = 'Лабораторії';
  searchPlaceholder: string = 'Пошук';
  filtersTitle: string = 'Фільтри';
  emptyListMessage: string = 'Лабораторій не знайдено';
  searchTerm: string = '';
  firstLoad = true;

  // Data
  laboratories: Laboratory[] = [];
  cities: City[] = [];
  schedules: Schedule[] = [];

  // Filtered data
  filteredLaboratories: Laboratory[] = [];
  selectedCities: number[] = [];
  allCitiesSelected =  false;
  someCitiesSelected = true;
  selectedScheduleId: number | null = 0;

  // Convert cities to FilterItem array
  get cityItems(): { id: number; name: string }[] {
    return this.cities.map(c => ({
      id: c.cityId,
      name: c.cityName
    }));
  }

  // Constructor
  constructor(
    private laboratoryService: LaboratoryService,
    private cityService: CityService,
    private scheduleService: ScheduleService,
    private authService: AuthService,
  ) {
  }

  // Lifecycle hook
  ngOnInit(): void {
    this.loadCities();
    this.fetchSchedules();
    this.loadLaboratories();
  }

  // Load laboratories from service
  loadLaboratories(): void {
    this.laboratoryService.getLaboratories().subscribe(labs => {
      this.laboratories = labs;
      this.filteredLaboratories = [...this.laboratories];
      if (!this.firstLoad) {
        this.applyFilters();
      }
      else {
        this.firstLoad = false;
      }
    });
  }

  // Load cities from service
  loadCities(): void {
    this.cityService.getCities().subscribe(cities => {
      this.cities = cities;
      this.selectedCities = cities.map(city => city.cityId);
    });
  }

  // Load schedules from service
  fetchSchedules(): void {
    this.scheduleService.getSchedules().subscribe({
      next: (schedules: Schedule[]) => {
        this.schedules = schedules;
        this.selectedScheduleId = schedules[0]?.scheduleId || 0;
      },
      error: (err) => {
        console.error('Error fetching schedules:', err);
      }
    });
  }

  // Handle schedule selection toggle
  toggleSchedule(scheduleId: number | null) : void {
    this.selectedScheduleId = scheduleId;
    if (scheduleId === null) {
      this.filteredLaboratories = [];
    }
    else if (scheduleId === 0) {
      this.filteredLaboratories = this.laboratories;
    }
    else {
      this.applyFilters();
    }
  }


  // Handle city selection toggle
  toggleCity(cityId: number) : void {
    const index = this.selectedCities.indexOf(cityId);
    if (index === -1) {
      this.selectedCities.push(cityId);
    } else {
      this.selectedCities.splice(index, 1);
    }
    this.onCitySelectionChange();
  }

  // Handle city selection
  onCitySelectionChange(): void {
    this.allCitiesSelected = this.selectedCities.length === this.cities.length;
    this.someCitiesSelected = this.selectedCities.length > 0 && !this.allCitiesSelected;
    this.applyFilters()
  }

  // Handle search input
  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  // Apply filters to the laboratory list
  applyFilters(): void {
    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredLaboratories = this.laboratories.filter(lab => {
      // Filter by selected cities
      const cityMatch = this.selectedCities.length === 0 ||
        this.selectedCities.includes(lab.cityId);

      // Filter by search term
      const searchMatch = !this.searchTerm ||
        lab.address.toLowerCase().includes(searchTermLower) ||
        (lab.city?.cityName?.toLowerCase().includes(searchTermLower)) ||
        lab.phoneNumber?.toLowerCase().includes(searchTermLower);

      // Filter by schedule
      const scheduleMatch = (!this.selectedScheduleId ||
        lab.laboratorySchedules.some(s => s.scheduleId === this.selectedScheduleId));

      return cityMatch && searchMatch && scheduleMatch;
    });
  }

  // TrackBy function
  trackByLaboratoryId($index: number, laboratory: Laboratory) {
    return laboratory.laboratoryId;
  }

  canCreate() {
    return this.authService.getCurrentUserRole() === UserRole.ADMIN;
  }
}
