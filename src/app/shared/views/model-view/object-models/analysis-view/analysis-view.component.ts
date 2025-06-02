// analysis-view.component.ts
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Analysis } from '../../../../../data/models/analysis';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { AnalysisService } from '../../../../../data/services/analysis.service';
import { AnalysisCategoryService } from '../../../../../data/services/analysis-category.service';
import { Category } from '../../../../../data/models/category';
import { BiomaterialService } from '../../../../../data/services/biomaterial.service';
import { CommonModule } from '@angular/common';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { AuthService } from '../../../../../data/services/auth.service';
import { UserRole } from '../../../../../data/models/user-role';
import { AnalysisBiomaterialCreateViewComponent } from '../../../../generics/object-create/analysis-biomaterial-create-view/analysis-biomaterial-create-view.component';
import { AnalysisBiomaterial } from '../../../../../data/models/analysis-biomaterial';

@Component({
  selector: 'app-analysis-view',
  imports: [
    CommonModule,
    FormsModule,
    MatIcon,
    ReactiveFormsModule,
    MatGridList,
    MatGridTile,
    AnalysisBiomaterialCreateViewComponent
  ],
  templateUrl: './analysis-view.component.html',
  styleUrl: './analysis-view.component.css',
  standalone: true,
})
export class AnalysisViewComponent implements OnInit {
  @Input() analysis!: Analysis;
  @Output() priceClick = new EventEmitter<Analysis>();
  @ViewChild('biomaterialComponent') biomaterialComponent!: AnalysisBiomaterialCreateViewComponent;

  isEditMode = false;
  editForm!: FormGroup;

  categoryOptions: Category[] = [];
  selectedBiomaterials: AnalysisBiomaterial[] = [];

  constructor(
    private authService: AuthService,
    private analysisService: AnalysisService,
    private categoryService: AnalysisCategoryService,
    private biomaterialService: BiomaterialService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  canEdit(): boolean {
    return this.authService.getCurrentUserRole() === UserRole.ADMIN;
  }

  initializeForm() {
    this.editForm = this.fb.group({
      name: [this.analysis.name, Validators.required],
      categoryId: [this.analysis.category.analysisCategoryId, Validators.required],
      description: [this.analysis.description, Validators.required],
      price: [this.analysis.price, [Validators.required, Validators.min(0)]]
    });

    this.selectedBiomaterials = [...this.analysis.analysisBiomaterials];
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.loadCategories();
      this.initializeForm();
    }
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categoryOptions = categories;
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  getCurrentBiomaterials(): AnalysisBiomaterial[] {
    if (!this.biomaterialComponent) {
      return this.selectedBiomaterials;
    }
    return this.biomaterialComponent.getCurrentBiomaterials();
  }

  saveChanges() {
    if (this.editForm.invalid || !this.biomaterialComponent?.canSubmit()) return;

    const formValue = this.editForm.value;
    const selectedCategory = this.categoryOptions.find(c => c.analysisCategoryId == formValue.categoryId);
    const biomaterials = this.getCurrentBiomaterials();

    const updatedAnalysis: Analysis = {
      ...this.analysis,
      name: formValue.name,
      category: selectedCategory || this.analysis.category,
      description: formValue.description,
      price: formValue.price,
      analysisBiomaterials: biomaterials
    };

    this.analysisService.updateAnalysis(updatedAnalysis).subscribe({
      next: (updatedAnalysis) => {
        this.analysis = updatedAnalysis;
        this.isEditMode = false;
      },
      error: (err) => console.error('Failed to update analysis', err)
    });
  }

  onPriceClick() {
    this.priceClick.emit(this.analysis);
  }
}
