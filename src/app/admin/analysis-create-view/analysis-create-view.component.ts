import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { GenericObjectCreateViewComponent } from '../../shared/generics/object-create/generic-object-create-view/generic-object-create-view.component';
import { AnalysisService } from '../../data/services/analysis.service';
import { Analysis } from '../../data/models/analysis';
import { AnalysisBiomaterialCreateViewComponent } from '../../shared/generics/object-create/analysis-biomaterial-create-view/analysis-biomaterial-create-view.component';
import { AnalysisCategoryService } from '../../data/services/analysis-category.service';
import { Category } from '../../data/models/category';
import { AnalysisViewComponent } from '../../shared/views/model-view/object-models/analysis-view/analysis-view.component';
import { AnalysisBiomaterial } from '../../data/models/analysis-biomaterial';

@Component({
  selector: 'app-analysis-create-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericObjectCreateViewComponent,
    AnalysisBiomaterialCreateViewComponent,
    AnalysisViewComponent
  ],
  templateUrl: './analysis-create-view.component.html',
  styleUrls: ['./analysis-create-view.component.css']
})
export class AnalysisCreateViewComponent implements OnInit {
  @ViewChild('biomaterialComponent')
  biomaterialComponent!: AnalysisBiomaterialCreateViewComponent;

  private fb = inject(FormBuilder);

  isLoading = false;
  createdAnalysis: Analysis | null = null;
  showConfirmation = false;
  @Input() categoryOptions: Category[] = [];

  analysisForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    categoryId: [null, Validators.required],
    description: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]]
  });

  constructor(
    private analysisService: AnalysisService,
    private categoryService: AnalysisCategoryService) {}

  ngOnInit(): void {
    if (this.categoryOptions.length === 0) {
      this.loadCategories();
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categoryOptions = categories;
      }
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categoryOptions.find(c => c.analysisCategoryId === categoryId);
    return category ? category.category : '';
  }

  getBiomaterials(): AnalysisBiomaterial[] {
    if (!this.biomaterialComponent) {
      return [];
    }
    return this.biomaterialComponent.getCurrentBiomaterials();
  }

  canSubmit(): boolean {
    if (!this.biomaterialComponent) {
      return false;
    }

    return this.analysisForm.valid && this.biomaterialComponent.canSubmit();
  }

  onSubmit(): void {
    if (this.canSubmit()) {
      const biomaterials = this.getBiomaterials();

      this.isLoading = true;
      const formValue = this.analysisForm.value;

      const analysisData = {
        analysisId: 0,
        name: formValue.name,
        categoryId: formValue.categoryId,
        description: formValue.description,
        price: formValue.price,
        category: {
          analysisCategoryId: formValue.categoryId,
          category: this.getCategoryName(formValue.categoryId)
        },
        analysisBiomaterials: biomaterials
      };

      this.analysisService.addAnalysis(analysisData).subscribe({
        next: (created) => {
          this.createdAnalysis = created;
          this.showConfirmation = true;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onConfirmationClosed(): void {
    this.showConfirmation = false;
    this.analysisForm.reset();
  }
}
