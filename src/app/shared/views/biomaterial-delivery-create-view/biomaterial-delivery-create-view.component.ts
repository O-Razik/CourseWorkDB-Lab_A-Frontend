import {Component} from '@angular/core';
import {
  GenericBpCreateViewComponent
} from '../../generics/bp-create/generic-bp-create-view/generic-bp-create-view.component';
import {NgIf} from '@angular/common';
import {BiomaterialDeliveryViewComponent} from '../biomaterial-delivery-view/biomaterial-delivery-view.component';
import {BiomaterialCollection} from '../../../data/models/biomaterial-collection';
import {AnalysisCenter} from '../../../data/models/analysis-center';
import {BiomaterialDeliveryService} from '../../../data/services/biomaterial-delivery.service';
import {BiomaterialDelivery} from '../../../data/models/biomaterial-delivery';
import {BpCreateTabComponent} from '../../generics/bp-create/bp-create-tab/bp-create-tab.component';
import {
  BpCreateTabContentComponent
} from '../../generics/bp-create/bp-create-tab-content/bp-create-tab-content.component';
import {
  BiomaterialCollectionListViewComponent
} from '../biomaterial-collection-list-view/biomaterial-collection-list-view.component';
import {
  AnalysisCenterSubListViewComponent
} from '../analysis-center-sub-list-view/analysis-center-sub-list-view.component';
import {
  BpCreateSummarySectionComponent
} from '../../generics/bp-create/bp-create-summary-section/bp-create-summary-section.component';

@Component({
  selector: 'app-biomaterial-delivery-create-view',
  imports: [
    GenericBpCreateViewComponent,
    NgIf,
    BiomaterialDeliveryViewComponent,
    BpCreateTabComponent,
    BpCreateTabContentComponent,
    BiomaterialCollectionListViewComponent,
    AnalysisCenterSubListViewComponent,
    BpCreateSummarySectionComponent,
  ],
  templateUrl: './biomaterial-delivery-create-view.component.html',
  styleUrl: './biomaterial-delivery-create-view.component.css',
  standalone: true,
})
export class BiomaterialDeliveryCreateViewComponent{
  activeTab: string = 'biomaterial-collection';

  selectedBiomaterialCollection: BiomaterialCollection | null = null;
  selectedAnalysisCenter : AnalysisCenter | null = null;
  confirmedDelivery: BiomaterialDelivery | null = null;
  showConfirmation: boolean = false;

  constructor(
    private biomaterialDeliveryService: BiomaterialDeliveryService
  ) {
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  onBiomaterialCollectionSelected(collection: BiomaterialCollection) {
    this.selectedBiomaterialCollection = collection;
    this.activeTab = 'analysis-center';
  }

  onAnalysisCenterSelected(center: AnalysisCenter) {
    this.selectedAnalysisCenter = center;
    this.activeTab = 'checkout';
  }

  showError(message: string) {
    // Implement your error display logic here
    // Could use a snackbar, toast, or modal
    alert(message); // Simple implementation - replace with your preferred UI
  }

  canCreateDelivery(): boolean {
    return !!this.selectedBiomaterialCollection && !!this.selectedAnalysisCenter;
  }

  resetSelection() {
    this.selectedBiomaterialCollection = null;
    this.selectedAnalysisCenter = null;
    this.activeTab = 'biomaterial-collection';
  }

  createDelivery() {
    if (!this.selectedBiomaterialCollection || !this.selectedAnalysisCenter) {
      this.showError('Please select both a biomaterial collection and an analysis center.');
      return;
    }

    const biomaterialDelivery: BiomaterialDelivery = {
      biomaterialDeliveryId: 0,
      biomaterialCollectionId: this.selectedBiomaterialCollection!.biomaterialCollectionId,
      analysisCenterId: this.selectedAnalysisCenter!.analysisCenterId,
      deliveryDate: new Date().toISOString(),
      statusId: 1,
      status: {
        statusId: 1,
        statusName: 'New',
      },
      analysisCenter: this.selectedAnalysisCenter!,
      biomaterialCollection: this.selectedBiomaterialCollection!,
    };

    this.biomaterialDeliveryService.createBiomaterialDelivery(biomaterialDelivery).subscribe({
      next: (delivery) => {
        console.log('Biomaterial delivery created successfully:', delivery);
        this.confirmedDelivery = delivery;
        this.showConfirmation = true;
        this.resetSelection();
      },
      error: (error) => {
        console.error('Error creating biomaterial delivery:', error);
        this.showError('Failed to create biomaterial delivery. Please try again.');
      }
    });
  }

  closeConfirmation() {
    this.showConfirmation = false;
    this.confirmedDelivery = null;

  }
}
