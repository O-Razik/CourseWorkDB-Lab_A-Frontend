import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InventoryInLaboratory} from '../../../../../data/models/inventory-in-laboratory';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-inventory-in-laboratory-view',
  imports: [
    DatePipe
  ],
  templateUrl: './inventory-in-laboratory-view.component.html',
  styleUrl: './inventory-in-laboratory-view.component.css',
  standalone: true,
})
export class InventoryInLaboratoryViewComponent {
  @Input() inventoryItem!: InventoryInLaboratory;
  @Input() isSelected = false;
  @Output() selected = new EventEmitter<void>();

  onClick() {
    this.selected.emit();
  }
}
