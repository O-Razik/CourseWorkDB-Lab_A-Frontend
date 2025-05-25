import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Biomaterial } from '../../../../data/models/biomaterial';
import { BiomaterialService } from '../../../../data/services/biomaterial.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/module.d-DKQBC69L';

@Component({
  selector: 'app-analysis-biomaterial-create-view',
  templateUrl: './analysis-biomaterial-create-view.component.html',
  styleUrls: ['./analysis-biomaterial-create-view.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatTooltip
  ]
})
export class AnalysisBiomaterialCreateViewComponent implements OnInit {
  @Input() biomaterials: Biomaterial[] = [];
  @Output() biomaterialsSubmit = new EventEmitter<{biomaterialId: number, isNew: boolean, newName?: string}[]>();

  biomaterialForm: FormGroup;
  newBiomaterialOption = { biomaterialId: 0, biomaterialName: 'Create New Biomaterial' };
  gridCols = 5;

  constructor(
    private fb: FormBuilder,
    private biomaterialService: BiomaterialService
  ) {
    this.biomaterialForm = this.fb.group({
      biomaterials: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadBiomaterials();
  }

  loadBiomaterials(): void {
    this.biomaterialService.getAllBiomaterials().subscribe((biomaterials: Biomaterial[]) => {
      this.biomaterials = biomaterials;
    });
  }

  get biomaterialArray(): FormArray {
    return this.biomaterialForm.get('biomaterials') as FormArray;
  }

  addBiomaterial(): void {
    const biomaterialGroup = this.fb.group({
      biomaterialId: [null, Validators.required],
      isNew: [false],
      newName: ['']
    });

    this.biomaterialArray.push(biomaterialGroup);
  }

  removeBiomaterial(index: number): void {
    this.biomaterialArray.removeAt(index);
  }
  onBiomaterialChange(index: number): void {
    const biomaterialGroup = this.biomaterialArray.at(index);
    const biomaterialId = biomaterialGroup.get('biomaterialId')?.value;

    if (biomaterialId === 0) {
      biomaterialGroup.get('isNew')?.setValue(true);
      biomaterialGroup.get('newName')?.setValidators([Validators.required]);
    } else {
      biomaterialGroup.get('isNew')?.setValue(false);
      biomaterialGroup.get('newName')?.clearValidators();
    }
    biomaterialGroup.get('newName')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.biomaterialForm.valid) {
      const formValue = this.biomaterialForm.value.biomaterials;
      this.biomaterialsSubmit.emit(formValue);
    }
  }

  getBiomaterialOptions(): any[] {
    return [this.newBiomaterialOption, ...this.biomaterials];
  }
}
