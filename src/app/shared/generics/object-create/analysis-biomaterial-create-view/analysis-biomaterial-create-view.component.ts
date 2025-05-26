import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Biomaterial } from '../../../../data/models/biomaterial';
import { BiomaterialService } from '../../../../data/services/biomaterial.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AnalysisBiomaterial } from '../../../../data/models/analysis-biomaterial';

@Component({
  selector: 'app-analysis-biomaterial-create-view',
  templateUrl: './analysis-biomaterial-create-view.component.html',
  styleUrls: ['./analysis-biomaterial-create-view.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AnalysisBiomaterialCreateViewComponent implements OnInit {
  @Input() initialBiomaterials: AnalysisBiomaterial[] = [];
  @Output() biomaterialsChange = new EventEmitter<AnalysisBiomaterial[]>();

  biomaterialForm: FormGroup;
  availableBiomaterials: Biomaterial[] = [];

  constructor(
    private fb: FormBuilder,
    private biomaterialService: BiomaterialService
  ) {
    this.biomaterialForm = this.fb.group({
      biomaterials: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadAvailableBiomaterials();
    this.initializeForm();

    this.biomaterialForm.valueChanges.subscribe(() => {
      if (this.biomaterialForm.valid) {
        this.emitCurrentBiomaterials();
      }
    });
  }

  loadAvailableBiomaterials(): void {
    this.biomaterialService.getAllBiomaterials().subscribe({
      next: (biomaterials) => {
        this.availableBiomaterials = biomaterials;
        this.initializeForm();
      },
      error: (err) => console.error('Failed to load biomaterials', err)
    });
  }

  initializeForm(): void {
    // Clear existing form array
    while (this.biomaterialArray.length) {
      this.biomaterialArray.removeAt(0);
    }

    // Add initial biomaterials if they exist
    if (this.initialBiomaterials && this.initialBiomaterials.length > 0) {
      this.initialBiomaterials.forEach(biomaterial => {
        this.addBiomaterial(biomaterial.biomaterialId);
      });
    }
  }

  get biomaterialArray(): FormArray {
    return this.biomaterialForm.get('biomaterials') as FormArray;
  }

  addBiomaterial(biomaterialId: number | null = null): void {
    const biomaterialGroup = this.fb.group({
      biomaterialId: [biomaterialId, Validators.required]
    });
    this.biomaterialArray.push(biomaterialGroup);
  }

  removeBiomaterial(index: number): void {
    this.biomaterialArray.removeAt(index);
  }

  emitCurrentBiomaterials(): void {
    const formValue = this.biomaterialForm.value.biomaterials;
    const currentBiomaterials: AnalysisBiomaterial[] = formValue.map((item: any) => ({
      // Preserve existing analysisBiomaterialId if editing
      analysisBiomaterialId: this.getExistingBiomaterialId(item.biomaterialId),
      biomaterialId: item.biomaterialId,
      analysisId: 0, // Will be set by parent component
      biomaterial: this.getBiomaterialDetails(item.biomaterialId)
    }));
    this.biomaterialsChange.emit(currentBiomaterials);
  }

  private getExistingBiomaterialId(biomaterialId: number): number {
    const existing = this.initialBiomaterials.find(b => b.biomaterialId === biomaterialId);
    return existing ? existing.analysisBiomaterialId : 0;
  }

  private getBiomaterialDetails(biomaterialId: number): Biomaterial | undefined {
    return this.availableBiomaterials.find(b => b.biomaterialId === biomaterialId);
  }

  getCurrentBiomaterials(): AnalysisBiomaterial[] {
    const formValue = this.biomaterialForm.value.biomaterials;
    return formValue.map((item: any) => ({
      analysisBiomaterialId: this.getExistingBiomaterialId(item.biomaterialId),
      biomaterialId: item.biomaterialId,
      analysisId: 0, // Will be set by parent component
      biomaterial: this.getBiomaterialDetails(item.biomaterialId)
    }));
  }
}
