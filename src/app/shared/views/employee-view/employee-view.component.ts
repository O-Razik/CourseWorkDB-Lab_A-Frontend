import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from '../../../data/models/employee';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-view',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.css',
  standalone: true,
})
export class EmployeeViewComponent {
  @Input() employee?: Employee;
}
