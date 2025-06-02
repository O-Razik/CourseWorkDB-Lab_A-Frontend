import {Component, Input} from '@angular/core';
import {BiomaterialDelivery} from '../../../../../data/models/biomaterial-delivery';
import {BiomaterialCollectionViewComponent} from '../biomaterial-collection-view/biomaterial-collection-view.component';
import {DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-biomaterial-delivery-view',
  imports: [
    BiomaterialCollectionViewComponent,
    DatePipe,
    NgClass,
  ],
  templateUrl: './biomaterial-delivery-view.component.html',
  styleUrl: './biomaterial-delivery-view.component.css',
  standalone: true,
})
export class BiomaterialDeliveryViewComponent {
  @Input() delivery!: BiomaterialDelivery;

  getStatusClass(statusName: string | undefined): string {
    if (!statusName) return 'status-default';

    switch(statusName.toLowerCase()) {
      case 'в процесі':
        return 'status-in-process';
      case 'завершений':
        return 'status-completed';
      case 'скасований':
        return 'status-canceled';
      default:
        return 'status-default';
    }
  }
}
