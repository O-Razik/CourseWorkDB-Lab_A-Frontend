import {Component, OnInit} from '@angular/core';
import {Analysis} from '../../data/models/analysis';
import {ClientListViewComponent} from '../../shared/views/list-views/client-list-view/client-list-view.component';
import {NgForOf, NgIf} from '@angular/common';
import {
  InventoryInLaboratoryListViewComponent
} from '../../shared/views/list-views/inventory-in-laboratory-list-view/inventory-in-laboratory-list-view.component';
import {AnalysisListViewComponent} from '../../shared/views/list-views/analysis-list-view/analysis-list-view.component';
import {Client} from '../../data/models/client';
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
import {FormsModule} from '@angular/forms';

interface AnalysisBiomaterialRequirement {
  analysisId: number;
  analysisName: string;
  biomaterialId: number;
  biomaterial: Biomaterial;
}

interface SelectedBiomaterial {
  analysisId: number;
  biomaterialId: number;
  biomaterial: Biomaterial;
}

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
    BpCreateOrderSummaryComponent,
    FormsModule
  ],
  standalone: true
})
export class ClientOrderCreateViewComponent implements OnInit {
  activeTab = 'client';

  selectedClient: Client | null = null;
  selectedInventories: number[] = [];
  selectedAnalyses: Analysis[] = [];
  selectedBiomaterials: SelectedBiomaterial[] = [];
  requiredBiomaterials: Biomaterial[] = [];
  selectedBiomaterial: Biomaterial | null = null;
  biomaterialInventoryMap: {[key: number]: InventoryInLaboratory} = {};
  analysisBiomaterialRequirements: AnalysisBiomaterialRequirement[] = [];
  biomaterialVolumeMap: {[key: number]: number} = {};
  confirmedOrder: ClientOrder | null = null;

  constructor(
    private clientOrderService: ClientOrderService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.updateRequiredBiomaterials();
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  onClientSelected(client: Client): void {
    this.selectedClient = client;
    this.setTab('analyses');
  }

  isBiomaterialSelected(analysisId: number, biomaterialId: number): boolean {
    return this.selectedBiomaterials.some(
      sb => sb.analysisId === analysisId && sb.biomaterialId === biomaterialId
    );
  }

  updateRequiredBiomaterialsFromSelection(): void {
    // Get unique biomaterials from selections
    const biomaterialMap = new Map<number, Biomaterial>();

    this.selectedBiomaterials.forEach(sb => {
      if (!biomaterialMap.has(sb.biomaterialId)) {
        biomaterialMap.set(sb.biomaterialId, sb.biomaterial);
      }
    });

    this.requiredBiomaterials = Array.from(biomaterialMap.values());
    this.verifyInventoryAssignments();
  }

  updateRequiredBiomaterials(): void {
    // This method is called when analyses are added/removed
    // We keep existing biomaterial selections if they're still valid

    // Remove selections for analyses that no longer exist
    const validAnalysisIds = this.selectedAnalyses.map(a => a.analysisId);
    this.selectedBiomaterials = this.selectedBiomaterials.filter(sb =>
      validAnalysisIds.includes(sb.analysisId)
    );

    this.updateRequiredBiomaterialsFromSelection();
  }

  selectBiomaterial(biomaterial: Biomaterial): void {
    this.selectedBiomaterial = biomaterial;
  }

  assignInventoryToBiomaterial(biomaterialId: number, inventory: InventoryInLaboratory): void {
    this.biomaterialInventoryMap[biomaterialId] = inventory;
    this.updateSelectedInventories();
  }

  updateSelectedInventories(): void {
    this.selectedInventories = Object.values(this.biomaterialInventoryMap)
      .map(inv => inv.inventoryInLaboratoryId);
  }

  hasInventoryForBiomaterial(biomaterialId: number): boolean {
    return !!this.biomaterialInventoryMap[biomaterialId];
  }

  getSelectedInventoryDetails(): {
    inventory: InventoryInLaboratory;
    biomaterialName: string;
    biomaterialId: number;
  }[] {
    if (Object.keys(this.biomaterialInventoryMap).length === 0) {
      return [];
    }

    return Object.entries(this.biomaterialInventoryMap).map(([biomaterialId, inventory]) => {
      const biomaterial = this.requiredBiomaterials.find(b => b.biomaterialId === +biomaterialId);
      return {
        inventory: inventory!,
        biomaterialName: biomaterial?.biomaterialName || 'N/A',
        biomaterialId: +biomaterialId
      };
    });
  }

  verifyInventoryAssignments(): void {
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
    // Remove analysis from selected analyses
    this.selectedAnalyses = this.selectedAnalyses.filter(a => a.analysisId !== analysisId);

    // Remove all biomaterial selections for this analysis
    this.selectedBiomaterials = this.selectedBiomaterials.filter(sb => sb.analysisId !== analysisId);

    // Update required biomaterials
    this.updateRequiredBiomaterialsFromSelection();
  }

  get totalPrice(): number {
    return this.selectedAnalyses.reduce((sum, a) => sum + (a.price ?? 0), 0);
  }

  isAnalysisBiomaterialCovered(analysisId: number, biomaterialId: number): boolean {
    // Check if this specific biomaterial is selected for any analysis that requires it
    return !!this.biomaterialInventoryMap[biomaterialId];
  }

  isAnalysisFullyCovered(analysisId: number): boolean {
    // Check if at least one biomaterial is selected for this analysis
    const analysisRequirements = this.analysisBiomaterialRequirements.filter(
      req => req.analysisId === analysisId
    );

    return analysisRequirements.some(req =>
      this.biomaterialInventoryMap[req.biomaterialId]
    );
  }

  isAnalysisCoveredButOptional(analysisId: number, biomaterialId: number): boolean {
    // True if analysis is covered by some other biomaterial but not this one
    return this.isAnalysisFullyCovered(analysisId) &&
      !this.isAnalysisBiomaterialCovered(analysisId, biomaterialId);
  }

  toggleBiomaterialSelection(analysisId: number, analysisBiomaterial: any): void {
    const biomaterialId = analysisBiomaterial.biomaterial.biomaterialId;
    const biomaterial = analysisBiomaterial.biomaterial;

    const existingIndex = this.selectedBiomaterials.findIndex(
      sb => sb.analysisId === analysisId && sb.biomaterialId === biomaterialId
    );

    if (existingIndex >= 0) {
      // Remove if already selected
      this.selectedBiomaterials.splice(existingIndex, 1);
    } else {
      // Add if not selected
      this.selectedBiomaterials.push({
        analysisId,
        biomaterialId,
        biomaterial
      });

      // Auto-select this biomaterial in the inventory tab
      this.selectedBiomaterial = biomaterial;
      // Auto-switch to inventory tab if not already there
      if (this.activeTab !== 'inventory') {
        this.setTab('inventory');
      }
    }

    // Update required biomaterials for inventory selection
    this.updateRequiredBiomaterialsFromSelection();
  }

  canCreateOrder(): boolean {
    if (!this.selectedClient || this.selectedAnalyses.length === 0) {
      return false;
    }

    // Check if each analysis has at least one biomaterial selected
    const hasAllBiomaterials = this.selectedAnalyses.every(analysis => {
      return this.selectedBiomaterials.some(sb => sb.analysisId === analysis.analysisId);
    });

    if (!hasAllBiomaterials) {
      return false;
    }

    // Check if all selected biomaterials have inventory assigned
    const allBiomaterialIds = [...new Set(this.selectedBiomaterials.map(sb => sb.biomaterialId))];
    return allBiomaterialIds.every(biomaterialId =>
      this.hasInventoryForBiomaterial(biomaterialId)
    );
  }

  resetOrder(): void {
    this.selectedClient = null;
    this.selectedAnalyses = [];
    this.selectedBiomaterials = [];
    this.selectedInventories = [];
    this.requiredBiomaterials = [];
    this.selectedBiomaterial = null;
    this.biomaterialInventoryMap = {};
    this.biomaterialVolumeMap = {};
    this.activeTab = 'client';
  }

  createOrder(): void {
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
          volume: this.biomaterialVolumeMap[+biomaterialId] || 200,
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

  showError(message: string): void {
    // Implement your error display logic here
    // Could use a snackbar, toast, or modal
    alert(message); // Simple implementation - replace with your preferred UI
  }

  showOrderConfirmation(order: ClientOrder): void {
    this.confirmedOrder = order;
  }

  closeConfirmation(): void {
    this.confirmedOrder = null;
  }

  preventInvalidInput(event: KeyboardEvent) {
    const forbiddenKeys = ['e', 'E', '+', '-', '.'];
    if (forbiddenKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  validateVolume(biomaterialId: number) {
    const inputValue = this.biomaterialVolumeMap[biomaterialId];

    if (inputValue < 1) {
      this.biomaterialVolumeMap[biomaterialId] = 1;
    } else if (inputValue > 5000) {
      this.biomaterialVolumeMap[biomaterialId] = 5000;
    }
  }
}
