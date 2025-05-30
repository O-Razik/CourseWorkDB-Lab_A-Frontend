import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';

import {GenericListViewComponent} from '../../../generics/generic-list-view/generic-list-view.component';

import {AnalysisViewComponent} from '../../model-view/analysis-view/analysis-view.component';

import {Analysis} from '../../../../data/models/analysis';
import {Category} from '../../../../data/models/category';
import {Biomaterial} from '../../../../data/models/biomaterial';

import {AnalysisService} from '../../../../data/services/analysis.service';
import {BiomaterialService} from '../../../../data/services/biomaterial.service';
import {AnalysisCategoryService} from '../../../../data/services/analysis-category.service';

import {TypeFilterComponent} from '../../../filters/type-filter/type-filter.component';
import {PriceFilterComponent} from '../../../filters/price-filter/price-filter.component';
import {FilterItem} from '../../../../data/helpers/filter-item';
import {AuthService} from '../../../../data/services/auth.service';
import {UserRole} from '../../../../data/models/user-role';
import {AnalysisCreateViewComponent} from '../../../../admin/analysis-create-view/analysis-create-view.component';


@Component({
  selector: 'app-analysis-list-view',
  imports: [
    GenericListViewComponent, AnalysisViewComponent,
    FormsModule, MatSliderModule, TypeFilterComponent, PriceFilterComponent, AnalysisCreateViewComponent
  ],
  templateUrl: './analysis-list-view.component.html',
  styleUrl: './analysis-list-view.component.css',
  standalone: true,
})
export class AnalysisListViewComponent implements OnInit  {

  // Configuration for generic list
  pageName: string = 'Аналізи';
  searchPlaceholder: string = 'Пошук';
  filtersTitle: string = 'Фільтри';
  emptyListMessage: string = 'Аналізів не знайдено';
  searchTerm: string = '';

  // Data
  analysisList: Analysis[] = [];
  categories: Category[] = [];
  biomaterials: Biomaterial[] = [];

  @Input() filterShown: boolean = true;

  // Filtered data
  filteredAnalyses: Analysis[] = [];
  selectedCategories: number[] = [];
  selectedBiomaterials: number[] = [];
  allCategoriesSelected = false;
  someCategoriesSelected = false;
  allBiomaterialsSelected = false;
  someBiomaterialsSelected = false;
  minPrice: number = 0;
  maxPrice: number = 9000;
  priceRange: [number, number] = [0, 9000];
  step: number = 10;

  @Output() analysisSelected = new EventEmitter<Analysis>();
  // Add this method
  onAnalysisSelect(analysis: Analysis) {
    this.analysisSelected.emit(analysis);
  }

  // Convert categories to FilterItem array
  get categoryItems(): FilterItem[] {
    return this.categories.map(c => ({
      id: c.analysisCategoryId,
      name: c.category
    }));
  }

  get biomaterialItems(): FilterItem[] {
    return this.biomaterials.map(b => ({
      id: b.biomaterialId,
      name: b.biomaterialName
    }));
  }

  // Constructor
  constructor(
    private analysisService: AnalysisService,
    private biomaterialService: BiomaterialService,
    private categoryService: AnalysisCategoryService,
    private authService: AuthService,
  ) {}

  canCreate(): boolean {
    return this.authService.getCurrentUserRole() === UserRole.ADMIN;
  }

  // Lifecycle hook
  ngOnInit(): void {
    this.fetchCategories();
    this.fetchBiomaterials();
    this.fetchAnalyses();
  }

  // Fetch data on initialization
  fetchAnalyses(): void {
    this.analysisService.getAllAnalyses().subscribe({
      next: (analyses) => {
        this.analysisList = analyses;
        this.filteredAnalyses = [...this.analysisList];
        this.getPriceRange(this.analysisList);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching analyses:', error);
      },
    });
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.selectedCategories = this.categories.map(c => c.analysisCategoryId);
        this.updateCategorySelectionState();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  fetchBiomaterials(): void {
    this.biomaterialService.getAllBiomaterials().subscribe({
      next: (biomaterials) => {
        this.biomaterials = biomaterials;
        this.selectedBiomaterials = this.biomaterials.map(b => b.biomaterialId);
        this.updateBiomaterialSelectionState();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching biomaterials:', error);
      },
    });
  }

  // TrackBy function
  trackByAnalysisId(index: number, analysis: Analysis): number {
    return analysis.analysisId;
  }

  // Filter logic
  toggleCategory(categoryId: number): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.updateCategorySelectionState();
    this.applyFilters();
  }

  updateCategorySelectionState(): void {
    const numSelected = this.selectedCategories.length;
    this.allCategoriesSelected = numSelected === this.categories.length;
    this.someCategoriesSelected = numSelected > 0 && !this.allCategoriesSelected;
  }

  toggleBiomaterial(biomaterialId: number): void {
    const index = this.selectedBiomaterials.indexOf(biomaterialId);
    if (index === -1) {
      this.selectedBiomaterials.push(biomaterialId);
    } else {
      this.selectedBiomaterials.splice(index, 1);
    }
    this.updateBiomaterialSelectionState();
    this.applyFilters();
  }

  updateBiomaterialSelectionState(): void {
    const numSelected = this.selectedBiomaterials.length;
    this.allBiomaterialsSelected = numSelected === this.biomaterials.length;
    this.someBiomaterialsSelected = numSelected > 0 && !this.allBiomaterialsSelected;
  }

  getPriceRange(analyses: Analysis[]): void {
    if (analyses.length === 0) {
      this.priceRange = [0, 9000];
      return;
    }

    const prices = analyses
      .map(analysis => analysis.price)
      .filter(price => !isNaN(price)) as number[];

    if (prices.length === 0) {
      this.priceRange = [0, 9000];
      return;
    }

    this.minPrice = Math.min(...prices);
    this.maxPrice = Math.max(...prices);
    this.priceRange = [this.minPrice, this.maxPrice];
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredAnalyses = this.analysisList.filter(analysis => {

      // Search term filter
      const matchesSearch = !this.searchTerm ||
        analysis.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        analysis.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = this.selectedCategories.length === 0 ||
        this.selectedCategories.includes(analysis.categoryId);

      // Biomaterial filter
      const matchesBiomaterial = this.selectedBiomaterials.length === 0 ||
        this.selectedBiomaterials.some(selectedId =>
          analysis.analysisBiomaterials.some(ab => ab.biomaterialId === selectedId)
        );

      // Price filter
      const matchesPrice = analysis.price >= this.priceRange[0] &&
        analysis.price <= this.priceRange[1];

      return matchesSearch && matchesCategory && matchesBiomaterial && matchesPrice;
    });
  }
}
