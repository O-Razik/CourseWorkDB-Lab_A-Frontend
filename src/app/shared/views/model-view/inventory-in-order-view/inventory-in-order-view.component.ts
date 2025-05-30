import {Component, Input, OnInit} from '@angular/core';
import { InventoryInOrder } from '../../../../data/models/inventory-in-order';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelDescription
} from '@angular/material/expansion';
import {DatePipe, NgForOf} from '@angular/common';
import {InventoryDelivery} from '../../../../data/models/inventory-delivery';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Laboratory} from '../../../../data/models/laboratory';
import {MatSnackBar} from '@angular/material/snack-bar';
import {InventoryDeliveryService} from '../../../../data/services/inventory-delivery.service';
import {LaboratoryService} from '../../../../data/services/laboratory.service';

@Component({
  selector: 'app-inventory-in-order-view',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    DatePipe,
    MatFormField,
    MatSelect,
    MatOption,
    MatInput,
    FormsModule,
    MatButton,
    ReactiveFormsModule,
    MatIcon,
    MatHint,
    MatLabel,
    NgForOf
  ],
  templateUrl: './inventory-in-order-view.component.html',
  styleUrls: ['./inventory-in-order-view.component.css']
})
export class InventoryInOrderViewComponent implements OnInit {
  @Input()
  inventoryInOrder!: InventoryInOrder;
  @Input()
  inventoryDelivery!: InventoryDelivery[];

  panelOpenState = false;
  showAddDeliveryForm = false;
  laboratories: Laboratory[] = [];
  deliveryForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private laboratoryService: LaboratoryService,
    private inventoryDeliveryService: InventoryDeliveryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadLaboratories();
  }

  initializeForm(): void {
    this.deliveryForm = new FormGroup({
      laboratoryId: new FormControl('', Validators.required),
      quantity: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.remainingQuantity())
      ])
    });
  }

  loadLaboratories(): void {
    this.laboratoryService.getLaboratories().subscribe({
      next: (labs) => this.laboratories = labs,
      error: (err) => {
        console.error('Failed to load laboratories', err);
        this.snackBar.open('Помилка завантаження лабораторій', 'Закрити', {
          duration: 3000
        });
      }
    });
  }

  canAddMoreDeliveries(): boolean {
    return this.remainingQuantity() > 0;
  }

  remainingQuantity(): number {
    if (!this.inventoryInOrder) return 0;

    const deliveredQuantity = this.inventoryInOrder.inventoryDeliveries?.reduce(
      (sum, delivery) => sum + delivery.quantity, 0
    ) || 0;

    return this.inventoryInOrder.quantity - deliveredQuantity;
  }

  startAddDelivery(): void {
    this.showAddDeliveryForm = true;
    this.deliveryForm.get('quantity')?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.remainingQuantity())
    ]);
    this.deliveryForm.get('quantity')?.updateValueAndValidity();
  }

  cancelAddDelivery(): void {
    this.showAddDeliveryForm = false;
    this.deliveryForm.reset({
      quantity: 1
    });
  }

  submitDelivery(): void {
    if (this.deliveryForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const formValue = this.deliveryForm.value;
    const selectedLab = this.laboratories.find(l => l.laboratoryId === formValue.laboratoryId);

    const newDelivery = {
      inventoryDeliveryId: 0,
      quantity: formValue.quantity,
      deliveryDate: new Date().toISOString(),
      statusId: 1, // Assuming 1 is "pending" status - adjust as needed
      inventoryInLaboratoryId: 0, // You'll need to set this properly
      inventoryInOrderId: this.inventoryInOrder.inventoryInOrderId,
      laboratoryFullAddress: selectedLab ? `${selectedLab.city.cityName}, ${selectedLab.address}` : 'Адреса не вказана',
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Example: 1 year from now
      inventoryInLaboratory: {
        inventoryInLaboratoryId: 0,
        expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        quantity: formValue.quantity,
        inventoryId: this.inventoryInOrder.inventory.inventoryId,
        laboratoryId: formValue.laboratoryId,
        inventory: {
          inventoryId: this.inventoryInOrder.inventory.inventoryId,
          inventoryName: this.inventoryInOrder.inventory.inventoryName,
          price: this.inventoryInOrder.inventory.price
        }
      },
      inventoryInOrder: {
        inventoryInOrderId: this.inventoryInOrder.inventoryInOrderId,
        price: this.inventoryInOrder.price,
        quantity: this.inventoryInOrder.quantity,
        inventoryId: this.inventoryInOrder.inventory.inventoryId,
        inventoryOrderId: this.inventoryInOrder.inventoryOrderId,
        inventory: {
          inventoryId: this.inventoryInOrder.inventory.inventoryId,
          inventoryName: this.inventoryInOrder.inventory.inventoryName,
          price: this.inventoryInOrder.inventory.price
        }
      },
      status: {
        statusId: 1,
        statusName: "Pending" // Adjust as needed
      }
    };

    this.inventoryDeliveryService.createInventoryDelivery(newDelivery).subscribe({
      next: (createdDelivery) => {
        // Add the new delivery to the list
        if (!this.inventoryInOrder.inventoryDeliveries) {
          this.inventoryInOrder.inventoryDeliveries = [];
        }
        this.inventoryInOrder.inventoryDeliveries.push(createdDelivery);

        // Reset the form
        this.showAddDeliveryForm = false;
        this.deliveryForm.reset({
          quantity: 1
        });
        this.isSubmitting = false;

        this.snackBar.open('Доставку успішно створено', 'Закрити', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Failed to create delivery', err);
        this.isSubmitting = false;
        this.snackBar.open('Помилка при створенні доставки', 'Закрити', {
          duration: 3000
        });
      }
    });
  }
}
