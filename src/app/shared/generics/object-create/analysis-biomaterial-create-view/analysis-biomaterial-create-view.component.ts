import {Component, inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { AnalysisBiomaterial } from '../../../../data/models/analysis-biomaterial';
import { BiomaterialService } from '../../../../data/services/biomaterial.service';
import { Biomaterial } from '../../../../data/models/biomaterial';

@Component({
  selector: 'app-analysis-biomaterial-create-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './analysis-biomaterial-create-view.component.html',
  styleUrls: ['./analysis-biomaterial-create-view.component.css']
})
export class AnalysisBiomaterialCreateViewComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder)
  @Input() initialBiomaterials: AnalysisBiomaterial[] = [];
  @Input() isInCreate: boolean = true;

  biomaterialForm = this.fb.group({
    biomaterials: this.fb.array([])
  });

  availableBiomaterials: Biomaterial[] = [];

  constructor(private biomaterialService: BiomaterialService) {}

  ngOnInit(): void {
    this.loadBiomaterials();
    this.initializeForm();
  }

  // Loads biomaterials from the service
  loadBiomaterials(): void {
    this.biomaterialService.getAllBiomaterials().subscribe({
      next: (biomaterials) => {
        this.availableBiomaterials = biomaterials;
      }
    });
  }

  // Initialize the form array with one empty biomaterial entry by default
  initializeForm(): void {
    this.biomaterialArray.clear();

    if (this.initialBiomaterials && this.initialBiomaterials.length > 0) {
      this.initialBiomaterials.forEach(bm => {
        const biomaterialGroup = this.fb.group({
          biomaterialId: [bm.biomaterialId, Validators.required]
        });
        this.biomaterialArray.push(biomaterialGroup);
      });
    } else {
      this.addBiomaterial(); // start with one empty select if no initial biomaterials
    }
  }

  getAnalysisId(): number {
    return this.initialBiomaterials[0]?.analysisId || 0;
  }

  // Getter for biomaterials form array
  get biomaterialArray(): FormArray {
    return this.biomaterialForm.get('biomaterials') as FormArray;
  }

  // Add a new biomaterial form group
  addBiomaterial(): void {
    const biomaterialGroup = this.fb.group({
      biomaterialId: [null, Validators.required]
    });
    this.biomaterialArray.push(biomaterialGroup);
  }

  // Remove biomaterial at index
  removeBiomaterial(index: number): void {
    this.biomaterialArray.removeAt(index);
  }

  // Return true if at least one biomaterial is selected (non-null biomaterialId)
  canSubmit(): boolean {
    if (this.biomaterialArray.length === 0) {
      return false;
    }
    // Check if at least one biomaterialId is not null or empty
    return (this.biomaterialArray.controls.some(control => !!control.get('biomaterialId')?.value));
  }

  getCurrentBiomaterials(): AnalysisBiomaterial[] {
    return this.biomaterialArray.controls
      .map(control => control.value)
      .filter(bm => bm.biomaterialId !== null)
      .map(bm => {
        const biomaterialObj = this.availableBiomaterials.find(b => b.biomaterialId === bm.biomaterialId);
        return {
          analysisBiomaterialId: 0,
          analysisId: this.getAnalysisId(),
          biomaterialId: bm.biomaterialId,
          biomaterial:  {
            biomaterialId: bm.biomaterialId,
            biomaterialName: biomaterialObj?.biomaterialName ?? ''
          }
        };
      });
  }

}
