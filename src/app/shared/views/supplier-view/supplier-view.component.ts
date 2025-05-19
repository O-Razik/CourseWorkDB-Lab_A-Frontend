import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Supplier} from '../../../data/models/supplier';

@Component({
  selector: 'app-supplier-view',
  imports: [],
  templateUrl: './supplier-view.component.html',
  styleUrl: './supplier-view.component.css',
  standalone: true,
})
export class SupplierViewComponent {
  @Input() supplier: Supplier | null = null;
  @Output() supplierSelected = new EventEmitter<Supplier>();
}
