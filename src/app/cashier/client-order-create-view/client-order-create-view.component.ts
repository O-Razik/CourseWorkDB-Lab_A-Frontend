import {Component, OnInit} from '@angular/core';
import { Analysis } from '../../data/models/analysis';
import { ClientListViewComponent } from '../../shared/views/list-views/client-list-view/client-list-view.component';
import { NgForOf, NgIf } from '@angular/common';
import { InventoryInLaboratoryListViewComponent } from '../../shared/views/list-views/inventory-in-laboratory-list-view/inventory-in-laboratory-list-view.component';
import { AnalysisListViewComponent } from '../../shared/views/list-views/analysis-list-view/analysis-list-view.component';
import { Client } from '../../data/models/client';
import {MatIcon} from '@angular/material/icon';
import {InventoryInLaboratory} from '../../data/models/inventory-in-laboratory';
import {Biomaterial} from '../../data/models/biomaterial';
import {ClientOrder} from '../../data/models/client-order';
import {ClientOrderService} from '../../data/services/client-order.service';
import {AuthService} from '../../data/services/auth.service';
import {OrderViewComponent} from '../../shared/views/model-view/process-models/order-view/order-view.component';
import {
  GenericBpCreateViewComponent
} from '../../shared/generics/bp-create/generic-bp-create-view/generic-bp-create-view.component';
import {BpCreateTabComponent} from '../../shared/generics/bp-create/bp-create-tab/bp-create-tab.component';
import {
  BpCreateTabContentComponent
} from '../../shared/generics/bp-create/bp-create-tab-content/bp-create-tab-content.component';
import {
  BpCreateSummarySectionComponent
} from '../../shared/generics/bp-create/bp-create-summary-section/bp-create-summary-section.component';
import {
  BpCreateOrderSummaryComponent
} from '../../shared/generics/bp-create/bp-create-order-summary/bp-create-order-summary.component';

@Component({
  selector: 'app-client-order-create-view',
  templateUrl: './client-order-create-view.component.html',
  styleUrls: ['./client-order-create-view.component.css'],
  imports: [
    ClientListViewComponent,
    NgIf,
    InventoryInLaboratoryListViewComponent,
    AnalysisListViewComponent,
    NgForOf,
    MatIcon,
    OrderViewComponent,
    GenericBpCreateViewComponent,
    BpCreateTabComponent,
    BpCreateTabContentComponent,
    BpCreateSummarySectionComponent,
    BpCreateOrderSummaryComponent
  ],
  standalone: true
})
export class ClientOrderCreateViewComponent implements OnInit {
  activeTab = 'client';

  selectedClient: Client | null = null;
  selectedInventories: number[] = [];
  selectedAnalyses: Analysis[] = [];
  requiredBiomaterials: Biomaterial[] = [];
  selectedBiomaterial: Biomaterial | null = null;
  biomaterialInventoryMap: {[key: number]: InventoryInLaboratory} = {};

  constructor(
    private clientOrderService: ClientOrderService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.updateRequiredBiomaterials();
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  onClientSelected(client: Client) {
    this.selectedClient = client;
    this.setTab('analyses');
  }

  updateRequiredBiomaterials() {
    const biomaterialMap = new Map<number, Biomaterial>();

    this.selectedAnalyses.forEach(analysis => {
      analysis.analysisBiomaterials.forEach(ab => {
        if (!biomaterialMap.has(ab.biomaterial.biomaterialId)) {
          biomaterialMap.set(ab.biomaterial.biomaterialId, ab.biomaterial);
        }
      });
    });

    this.requiredBiomaterials = Array.from(biomaterialMap.values());
    this.verifyInventoryAssignments();
  }

  selectBiomaterial(biomaterial: Biomaterial) {
    this.selectedBiomaterial = biomaterial;
  }

  assignInventoryToBiomaterial(biomaterialId: number, inventory: InventoryInLaboratory) {
    this.biomaterialInventoryMap[biomaterialId] = inventory;
    this.updateSelectedInventories();
  }

  removeInventory(inventoryId: number) {
    for (const biomaterialId in this.biomaterialInventoryMap) {
      if (this.biomaterialInventoryMap[biomaterialId].inventoryInLaboratoryId === inventoryId) {
        delete this.biomaterialInventoryMap[biomaterialId];
        break;
      }
    }
    this.updateSelectedInventories();
  }

  updateSelectedInventories() {
    this.selectedInventories = Object.values(this.biomaterialInventoryMap)
      .map(inv => inv.inventoryInLaboratoryId);
  }

  hasInventoryForBiomaterial(biomaterialId: number): boolean {
    return !!this.biomaterialInventoryMap[biomaterialId];
  }

  getSelectedInventoryDetails(): any[] {
    return Object.entries(this.biomaterialInventoryMap).map(([biomaterialId, inventory]) => {
      const biomaterial = this.requiredBiomaterials.find(b => b.biomaterialId === +biomaterialId);
      return {
        ...inventory,
        biomaterialName: biomaterial?.biomaterialName || 'N/A'
      };
    });
  }

  verifyInventoryAssignments() {
    const requiredIds = this.requiredBiomaterials.map(b => b.biomaterialId);
    for (const biomaterialId in this.biomaterialInventoryMap) {
      if (!requiredIds.includes(+biomaterialId)) {
        delete this.biomaterialInventoryMap[biomaterialId];
      }
    }
    this.updateSelectedInventories();
  }

  getSelectedInventoryIdForBiomaterial(biomaterialId: number | undefined): number | null {
    if (!biomaterialId) return null;
    return this.biomaterialInventoryMap[biomaterialId]?.inventoryInLaboratoryId || null;
  }

  getSelectedInventoryCount(): number {
    return Object.keys(this.biomaterialInventoryMap).length;
  }

  getInventoryStatusText(biomaterialId: number): string {
    const inventory = this.biomaterialInventoryMap[biomaterialId];
    return inventory ? 'Обрано: ' + inventory.inventory.inventoryName : 'Не обрано';
  }

  getSelectedInventoryInfo(biomaterialId: number): string {
    const inventory = this.biomaterialInventoryMap[biomaterialId];
    if (!inventory) return '';

    return `${inventory.inventory.inventoryName}`;
  }

  removeInventoryForBiomaterial(biomaterialId: number): void {
    delete this.biomaterialInventoryMap[biomaterialId];
    this.updateSelectedInventories();
  }

  onInventorySelectedForBiomaterial(biomaterialId: number | undefined, inventory: InventoryInLaboratory): void {
    if (!biomaterialId) return;

    // If already selected for this biomaterial, unselect it
    if (this.biomaterialInventoryMap[biomaterialId]?.inventoryInLaboratoryId === inventory.inventoryInLaboratoryId) {
      this.removeInventoryForBiomaterial(biomaterialId);
    } else {
      this.assignInventoryToBiomaterial(biomaterialId, inventory);
    }
  }

  addAnalysisToOrder(analysis: Analysis): void {
    const alreadyAdded = this.selectedAnalyses.some(a => a.analysisId === analysis.analysisId);
    if (!alreadyAdded) {
      this.selectedAnalyses.push(analysis);
      this.updateRequiredBiomaterials();
    }
  }

  removeAnalysis(analysisId: number): void {
    this.selectedAnalyses = this.selectedAnalyses.filter(a => a.analysisId !== analysisId);
    this.updateRequiredBiomaterials();
  }

  get totalPrice(): number {
    return this.selectedAnalyses.reduce((sum, a) => sum + (a.price ?? 0), 0);
  }

  canCreateOrder(): boolean {
    return (
      this.selectedClient !== null &&
      this.selectedAnalyses.length > 0 &&
      this.requiredBiomaterials.length === Object.keys(this.biomaterialInventoryMap).length
    );
  }

  resetOrder() {
    this.selectedClient = null;
    this.selectedAnalyses = [];
    this.selectedInventories = [];
    this.requiredBiomaterials = [];
    this.selectedBiomaterial = null;
    this.biomaterialInventoryMap = {};
    this.activeTab = 'client';
  }

  createOrder() {
    if (!this.canCreateOrder()) {
      return;
    }

    const currentEmployee = this.authService.getCurrentEmployee();
    if (!currentEmployee || !this.selectedClient) {
      console.error('Missing required data');
      return;
    }

    // Prepare the complete order data structure
    const orderData = {
      clientOrderId: 0,
      number: 0, // Will be generated by backend
      statusId: 1, // Assuming 1 is "New" status
      employeeId: currentEmployee.employeeId,
      clientId: this.selectedClient.clientId,
      biomaterialCollectionDate: new Date().toISOString(),
      fullprice: this.totalPrice,
      client: {
        clientId: this.selectedClient.clientId,
        firstName: this.selectedClient.firstName,
        lastName: this.selectedClient.lastName,
        sexId: this.selectedClient.sexId,
        birthdate: this.selectedClient.birthdate,
        phoneNumber: this.selectedClient.phoneNumber,
        email: this.selectedClient.email,
        sex: this.selectedClient.sex
      },
      employee: {
        employeeId: currentEmployee.employeeId,
        positionId: currentEmployee.positionId,
        laboratoryId: currentEmployee.laboratoryId,
        firstName: currentEmployee.firstName,
        lastName: currentEmployee.lastName,
        phoneNumber: currentEmployee.phoneNumber,
        email: currentEmployee.email,
        position: currentEmployee.position,
        laboratory: currentEmployee.laboratory
      },
      orderAnalyses: this.selectedAnalyses.map(analysis => ({
        orderAnalysisId: 0,
        analysisId: analysis.analysisId,
        clientOrderId: 0,
        analysis: {
          analysisId: analysis.analysisId,
          name: analysis.name,
          categoryId: analysis.categoryId,
          description: analysis.description,
          price: analysis.price,
          analysisBiomaterials: analysis.analysisBiomaterials,
          category: analysis.category
        }
      })),
      biomaterialCollections: Object.entries(this.biomaterialInventoryMap).map(([biomaterialId, inventory]) => {
        const biomaterial = this.requiredBiomaterials.find(b => b.biomaterialId === +biomaterialId);
        return {
          biomaterialCollectionId: 0,
          expirationDate: inventory.expirationDate,
          volume: 200,
          collectionDate: new Date().toISOString().split('T')[0], // DateOnly format
          biomaterialId: +biomaterialId,
          clientOrderId: 0,
          clientOrderNumber: 0,
          inventoryInLaboratoryId: inventory.inventoryInLaboratoryId,
          biomaterial: biomaterial ? {
            biomaterialId: biomaterial.biomaterialId,
            biomaterialName: biomaterial.biomaterialName
          } : null,
          inventoryInLaboratory: {
            inventoryInLaboratoryId: inventory.inventoryInLaboratoryId,
            expirationDate: inventory.expirationDate,
            quantity: inventory.quantity,
            inventoryId: inventory.inventoryId,
            laboratoryId: inventory.laboratoryId,
            inventory: inventory.inventory
          }
        };
      }),
      status: {
        statusId: 1,
        statusName: 'New'
      }
    };

    this.clientOrderService.createClientOrder(orderData).subscribe({
      next: (createdOrder) => {
        this.showOrderConfirmation(createdOrder);
        this.resetOrder();
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.showError('Помилка при створенні замовлення. Спробуйте ще раз.');
      }
    });
  }

  showError(message: string) {
    // Implement your error display logic here
    // Could use a snackbar, toast, or modal
    alert(message); // Simple implementation - replace with your preferred UI
  }

  confirmedOrder: ClientOrder | null = null;

  showOrderConfirmation(order: ClientOrder) {
    this.confirmedOrder = order;
  }

  closeConfirmation() {
    this.confirmedOrder = null;
  }
}
