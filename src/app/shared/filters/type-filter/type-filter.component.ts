import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {RequiredValidator} from '@angular/forms';
import {FilterItem} from '../../../data/helpers/filter-item';

@Component({
  selector: 'app-type-filter',
  imports: [MatCheckbox],
  templateUrl: './type-filter.component.html',
  styleUrl: './type-filter.component.css',
  standalone: true,
})
export class TypeFilterComponent {

  @Input({ required: true }) sectionName: string = '';
  @Input({ required: true }) items: FilterItem[] = [];
  @Input({ required: true }) selectedItems: number[] = [];
  @Output() itemToggled = new EventEmitter<number>();

  toggleItem(itemId: number): void {
    this.itemToggled.emit(itemId);
  }
}
