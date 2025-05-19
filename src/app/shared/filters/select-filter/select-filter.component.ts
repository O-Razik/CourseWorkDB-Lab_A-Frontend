import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { FilterItem } from '../../../data/helpers/filter-item';

@Component({
  selector: 'app-select-filter',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './select-filter.component.html',
  styleUrl: './select-filter.component.css',
  standalone: true
})
export class SelectFilterComponent implements OnInit {
  @Input({ required: true }) sectionName = 'Фільтр:';
  @Input({ required: true }) placeholder = 'Виберіть опцію';
  @Input({ required: true }) items: FilterItem[] = [];
  @Output() filterChanged = new EventEmitter<number | string | null>();

  selectedValue: number | string | null = '';
  isLoading = true;

  ngOnInit(): void {
    this.isLoading = false;
  }

  applyFilter(): void {
    this.filterChanged.emit(this.selectedValue || null);
  }
}
