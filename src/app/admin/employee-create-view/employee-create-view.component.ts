import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { GenericObjectCreateViewComponent } from '../../shared/generics/object-create/generic-object-create-view/generic-object-create-view.component';
import { EmployeeService } from '../../data/services/employee.service';
import { Employee } from '../../data/models/employee';
import {Position} from '../../data/models/position';
import {Laboratory} from '../../data/models/laboratory';
import {LaboratoryService} from '../../data/services/laboratory.service';
import {EmployeeViewComponent} from '../../shared/views/model-view/object-models/employee-view/employee-view.component';

@Component({
  selector: 'app-employee-create-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericObjectCreateViewComponent, EmployeeViewComponent],
  templateUrl: './employee-create-view.component.html',
  styleUrls: ['./employee-create-view.component.css']
})
export class EmployeeCreateViewComponent implements OnInit {
  @Input() positions: Position[] = [];
  @Input() laboratories: Laboratory[] = [];

  private fb = inject(FormBuilder);
  isLoading = false;
  createdEmployee: Employee | null = null;
  showConfirmation = false;

  constructor(
    private employeeService: EmployeeService,
    private laboratoryService: LaboratoryService) {
  }

  employeeForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    positionId: [null, Validators.required],
    laboratoryId: [null, Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    if (this.positions.length === 0) {
      this.employeeService.getPositions().subscribe({
        next: (positions) => {
          this.positions = positions;
        }
      });
    }

    if (this.laboratories.length === 0) {
      this.laboratoryService.getLaboratories().subscribe({
        next: (laboratories) => {
          this.laboratories = laboratories;
        }
      });
    }
  }

  get positionOptions(): Position[] {
    return this.positions;
  }

  get laboratoryOptions(): Laboratory[] {
    return this.laboratories;
  }

  getPositionName(positionId: number): string {
    const position = this.positions.find(p => p.positionId === positionId);
    return position ? position.positionName : '';
  }

  getLaboratory(laboratoryId: number): Laboratory | undefined {
    return this.laboratories.find(l => l.laboratoryId === laboratoryId);
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      const formValue = this.employeeForm.value;

      const employee: Employee = {
        employeeId: 0,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        positionId: formValue.positionId,
        laboratoryId: formValue.laboratoryId,
        phoneNumber: formValue.phoneNumber,
        email: formValue.email,
        laboratory: {
          laboratoryId: formValue.laboratoryId,
          address: this.getLaboratory(formValue.laboratoryId)?.address || '',
          cityId: this.getLaboratory(formValue.laboratoryId)?.cityId || 0,
          phoneNumber: this.getLaboratory(formValue.laboratoryId)?.phoneNumber || '',
          city: {
            cityId: this.getLaboratory(formValue.laboratoryId)?.cityId || 0,
            cityName: this.getLaboratory(formValue.laboratoryId)?.city?.cityName || ''
          }
        },
        position: {
          positionId: formValue.positionId,
          positionName: this.getPositionName(formValue.positionId)
        }
      };

      this.employeeService.addEmployee(employee).subscribe({
        next: (created) => {
          this.createdEmployee = created;
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
    this.employeeForm.reset();
  }
}
