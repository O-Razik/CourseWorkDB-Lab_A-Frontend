import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Inventory } from '../../../../../data/models/inventory';
import { InventoryService } from '../../../../../data/services/inventory.service';
import { CommonModule } from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-inventory-view',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIcon],
  templateUrl: './inventory-view.component.html',
  styleUrl: './inventory-view.component.css',
})
export class InventoryViewComponent {
  private inventoryService = inject(InventoryService);

  @Input() inventory: Inventory = null!;
  @Input() isEditPerm: boolean | null = null;
  @Input() canEdit: boolean = false;
  @Output() inventorySelected = new EventEmitter<Inventory>();

  editedInventoryName = '';
  editedPrice = 0;
  isEditing = false;
  isLoading = false;
  errorMessage: string | null = null;

  get isEditMode() {
    return this.isEditing && this.canEdit;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editedInventoryName = this.inventory.inventoryName;
      this.editedPrice = this.inventory.price;
    }
  }

  async onSave() {
    if (!this.isEditPerm) {
      this.onApplyTemporary();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const updatedInventory = {
        ...this.inventory,
        inventoryName: this.editedInventoryName,
        price: this.editedPrice
      };

      this.inventoryService.updateInventory(updatedInventory).subscribe({
        next: (data) => {
          this.inventory = data;
          this.editedInventoryName = data.inventoryName;
          this.editedPrice = data.price;
          this.inventorySelected.emit(data);
          this.isEditing = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to save changes';
          console.error('Error updating inventory:', err);
        }
      });
    } catch (error) {
      this.errorMessage = 'Failed to save changes';
      console.error('Error updating inventory:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onApplyTemporary() {
    this.inventory.price = this.editedPrice;
    this.isEditing = false;
  }

  onCancel() {
    this.isEditing = false;
  }

  onClick() {
    if (!this.isEditMode) {
      this.inventorySelected.emit(this.inventory);
    }
  }
}
