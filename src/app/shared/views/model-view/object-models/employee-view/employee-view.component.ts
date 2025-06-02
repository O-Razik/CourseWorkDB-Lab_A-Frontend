import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Employee } from '../../../../../data/models/employee';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Position } from '../../../../../data/models/position';
import { LaboratoryService } from '../../../../../data/services/laboratory.service';
import { Laboratory } from '../../../../../data/models/laboratory';
import { EmployeeService } from '../../../../../data/services/employee.service';
import { AuthService } from '../../../../../data/services/auth.service';
import { UserRole } from '../../../../../data/models/user-role';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridList,
    MatGridTile
  ],
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css'],
})
export class EmployeeViewComponent implements OnInit {
  @Input() employee?: Employee;
  @Output() employeeUpdated = new EventEmitter<Employee>();

  isEditMode = false;
  editForm!: FormGroup;
  positionOptions: Position[] = [];
  laboratoryOptions: Laboratory[] = [];

  constructor(
    private fb: FormBuilder,
    private laboratoryService: LaboratoryService,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.employee) {
      this.initializeForm();
    }
  }

  canEdit(): boolean {
    const currentEmployee = this.authService.getCurrentEmployee();
    const isSameEmployee = this.employee!.employeeId === currentEmployee!.employeeId;
    return !isSameEmployee && this.authService.getCurrentUserRole() === UserRole.ADMIN;
  }

  initializeForm() {
    if (!this.employee) return;

    this.editForm = this.fb.group({
      firstName: [this.employee.firstName, Validators.required],
      lastName: [this.employee.lastName, Validators.required],
      positionId: [this.employee.position?.positionId, Validators.required],
      laboratoryId: [this.employee.laboratory?.laboratoryId, Validators.required],
      phoneNumber: [this.employee.phoneNumber, [Validators.required, Validators.pattern(/^\+380\d{9}$/)]],
      email: [this.employee.email, [Validators.required, Validators.email]]
    });
  }

  toggleEditMode(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.loadPositionOptions();
      this.loadLaboratoryOptions();
      this.initializeForm();
    }
  }

  loadPositionOptions() {
    this.employeeService.getPositions().subscribe({
      next: (positions) => {
        this.positionOptions = positions;
      },
      error: (err) => console.error('Failed to load positions', err)
    });
  }

  loadLaboratoryOptions() {
    this.laboratoryService.getLaboratories().subscribe({
      next: (laboratories) => {
        this.laboratoryOptions = laboratories;
      },
      error: (err) => console.error('Failed to load laboratories', err)
    });
  }

  saveChanges() {
    if (this.editForm.invalid || !this.employee) return;

    const formValue = this.editForm.value;
    const selectedPosition = this.positionOptions.find(p => p.positionId == formValue.positionId);
    const selectedLaboratory = this.laboratoryOptions.find(l => l.laboratoryId == formValue.laboratoryId);

    const updatedEmployee: Employee = {
      ...this.employee,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      position: selectedPosition || this.employee.position,
      laboratory: selectedLaboratory || this.employee.laboratory,
      phoneNumber: formValue.phoneNumber,
      email: formValue.email
    };

    this.employeeService.updateEmployee(updatedEmployee).subscribe({
      next: (updatedEmployee) => {
        this.employee = updatedEmployee;
        this.isEditMode = false;
        this.employeeUpdated.emit(updatedEmployee);
      },
      error: (err) => console.error('Failed to update employee', err)
    });
  }
}
