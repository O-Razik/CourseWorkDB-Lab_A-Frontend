import {Component, Input} from '@angular/core';
import {BiomaterialDelivery} from '../../../data/models/biomaterial-delivery';
import {BiomaterialCollectionViewComponent} from '../biomaterial-collection-view/biomaterial-collection-view.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-biomaterial-delivery-view',
  imports: [
    BiomaterialCollectionViewComponent,
    DatePipe,
  ],
  templateUrl: './biomaterial-delivery-view.component.html',
  styleUrl: './biomaterial-delivery-view.component.css',
  standalone: true,
})
export class BiomaterialDeliveryViewComponent {
  @Input() delivery!: BiomaterialDelivery;
}
