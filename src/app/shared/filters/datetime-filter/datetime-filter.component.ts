import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-datetime-filter',
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatButton
  ],
  templateUrl: './datetime-filter.component.html',
  styleUrl: './datetime-filter.component.css',
  standalone: true
})
export class DatetimeFilterComponent {
  @Input() sectionName: string = 'Дата збору';
  @Input() dateRange: [Date | null, Date | null] = [null, null];
  @Output() dateRangeChange = new EventEmitter<[Date | null, Date | null]>();

  validateDateRange(): void {
    // Ensure start date is before end date
    if (this.dateRange[0] && this.dateRange[1] && this.dateRange[0] > this.dateRange[1]) {
      [this.dateRange[0], this.dateRange[1]] = [this.dateRange[1], this.dateRange[0]];
    }
    this.dateRangeChange.emit(this.dateRange);
  }

  clearDates(): void {
    this.dateRange = [null, null];
    this.dateRangeChange.emit(this.dateRange);
  }
}
