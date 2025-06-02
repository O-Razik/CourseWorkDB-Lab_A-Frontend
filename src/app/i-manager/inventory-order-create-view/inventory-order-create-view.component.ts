// Updated Component Class
import { Component } from '@angular/core';
import { Supplier } from '../../data/models/supplier';
import { Inventory } from '../../data/models/inventory';
import { InventoryOrderService } from '../../data/services/inventory-order.service';
import { SupplierService } from '../../data/services/supplier.service';
import { InventoryService } from '../../data/services/inventory.service';
import { AuthService } from '../../data/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';
import { SupplierSubListViewComponent } from '../../shared/views/sub-list-views/supplier-sub-list-view/supplier-sub-list-view.component';
import { InventorySubListViewComponent } from '../../shared/views/sub-list-views/inventory-sub-list-view/inventory-sub-list-view.component';
import { InventoryOrderViewComponent } from '../../shared/views/model-view/process-models/inventory-order-view/inventory-order-view.component';
import {InventoryOrder} from '../../data/models/inventory-order';
import {
    GenericBpCreateViewComponent
} from "../../shared/generics/bp-create/generic-bp-create-view/generic-bp-create-view.component";
import {BpCreateTabComponent} from '../../shared/generics/bp-create/bp-create-tab/bp-create-tab.component';
import {
  BpCreateTabContentComponent
} from '../../shared/generics/bp-create/bp-create-tab-content/bp-create-tab-content.component';
import {
  BpCreateOrderSummaryComponent
} from '../../shared/generics/bp-create/bp-create-order-summary/bp-create-order-summary.component';
import {
  BpCreateSummarySectionComponent
} from '../../shared/generics/bp-create/bp-create-summary-section/bp-create-summary-section.component';

interface SelectedInventoryItem {
  inventory: Inventory;
  quantity: number;
}

@Component({
  selector: 'app-inventory-order-create-view',
  imports: [MatIcon, NgIf, NgFor, SupplierSubListViewComponent, InventorySubListViewComponent, InventoryOrderViewComponent, GenericBpCreateViewComponent, BpCreateTabComponent, BpCreateTabContentComponent, BpCreateOrderSummaryComponent, BpCreateSummarySectionComponent],
  templateUrl: './inventory-order-create-view.component.html',
  styleUrl: './inventory-order-create-view.component.css',
  standalone: true,
})
export class InventoryOrderCreateViewComponent {
  activeTab = 'supplier';
  inventoryItems: Inventory[] = [];
  suppliers: Supplier[] = [];
  selectedSupplier: Supplier | null = null;
  selectedInventoryItems: SelectedInventoryItem[] = [];
  showConfirmation = false;
  confirmedOrder: InventoryOrder | null = null;

  constructor(
    private supplierService: SupplierService,
    private inventoryOrderService: InventoryOrderService,
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadSuppliers();
    this.loadInventoryItems();
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => this.suppliers = suppliers,
      error: (err) => console.error('Error loading suppliers:', err)
    });
  }

  loadInventoryItems() {
    this.inventoryService.getAllInventories().subscribe({
      next: (items) => this.inventoryItems = items,
      error: (err) => console.error('Error loading inventory:', err)
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  onSupplierSelected(supplier: Supplier) {
    this.selectedSupplier = supplier;
    this.setTab('inventory');
  }

  addInventoryItem(item: Inventory) {
    const existingItem = this.selectedInventoryItems.find(i => i.inventory.inventoryId === item.inventoryId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.selectedInventoryItems.push({
        inventory: item,
        quantity: 1
      });
    }
  }

  removeInventoryItem(inventoryId: number) {
    this.selectedInventoryItems = this.selectedInventoryItems.filter(
      item => item.inventory.inventoryId !== inventoryId
    );
  }

  removeAllInventoryItems() {
    this.selectedInventoryItems = [];
  }

  increaseQuantity(item: SelectedInventoryItem) {
    item.quantity += 1;
  }

  decreaseQuantity(item: SelectedInventoryItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.removeInventoryItem(item.inventory.inventoryId);
    }
  }

  get totalPrice(): number {
    return this.selectedInventoryItems.reduce(
      (sum, item) => sum + (item.inventory.price ?? 0) * item.quantity, 0
    );
  }

  get totalItems(): number {
    return this.selectedInventoryItems.reduce(
      (sum, item) => sum + item.quantity, 0
    );
  }

  canCreateOrder(): boolean {
    return this.selectedSupplier !== null && this.selectedInventoryItems.length > 0;
  }

  resetOrder() {
    this.selectedSupplier = null;
    this.selectedInventoryItems = [];
    this.activeTab = 'supplier';
  }

  createOrder() {
    if (!this.canCreateOrder()) return;

    const currentEmployee = this.authService.getCurrentEmployee();
    if (!currentEmployee) {
      console.error('No employee logged in');
      return;
    }

    // Prepare the order data with all required fields
    const orderData = {
      supplierId: this.selectedSupplier!.supplierId,
      statusId: 1, // Assuming 1 is a valid default status ID
      orderDate: new Date().toISOString(),
      fullprice: this.totalPrice,
      inventoryInOrders: this.selectedInventoryItems.map(item => ({
        quantity: item.quantity,
        price: item.inventory.price ?? 0,
        inventoryId: item.inventory.inventoryId,
        inventory: {
          inventoryId: item.inventory.inventoryId,
          inventoryName: item.inventory.inventoryName,
          price: item.inventory.price ?? 0
        },
        inventoryDeliveries: [] // Empty array as required by validation
      })),
      supplier: {
        supplierId: this.selectedSupplier!.supplierId,
        name: this.selectedSupplier!.name,
        email: this.selectedSupplier!.email ?? '',
        phoneNumber: this.selectedSupplier!.phoneNumber ?? '',
        license: this.selectedSupplier!.license ?? ''
      },
      status: {
        statusId: 1, // Must match statusId above
        statusName: 'Pending' // Example default status
      }
    };

    console.log('Order payload:', JSON.stringify(orderData, null, 2)); // Debug log

    this.inventoryOrderService.createInventoryOrder(orderData).subscribe({
      next: (createdOrder) => {
        this.confirmedOrder = createdOrder;
        this.showConfirmation = true;
        this.resetOrder();
      },
      error: (err) => {
        console.error('Full error:', err);
        if (err.error?.errors) {
          console.error('Validation errors:', err.error.errors);
          alert(`Validation errors: ${JSON.stringify(err.error.errors)}`);
        } else {
          alert('Помилка при створенні замовлення');
        }
      }
    });
  }

  closeConfirmation() {
    this.showConfirmation = false;
    this.confirmedOrder = null;
  }
}
