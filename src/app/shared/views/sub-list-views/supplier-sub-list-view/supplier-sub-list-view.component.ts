import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GenericSubListViewComponent} from '../../../generics/generic-sub-list-view/generic-sub-list-view.component';
import {SupplierViewComponent} from '../../model-view/supplier-view/supplier-view.component';
import {Supplier} from '../../../../data/models/supplier';
import {SupplierService} from '../../../../data/services/supplier.service';

@Component({
  selector: 'app-supplier-sub-list-view',
  imports: [
    GenericSubListViewComponent,
    SupplierViewComponent
  ],
  templateUrl: './supplier-sub-list-view.component.html',
  styleUrl: './supplier-sub-list-view.component.css',
  standalone: true,
})
export class SupplierSubListViewComponent implements OnInit{
  @Input() suppliers: Supplier[] = [];
  @Output() supplierSelected = new EventEmitter<Supplier>();

  constructor(
    private supplierService: SupplierService,
  ) {
  }

  ngOnInit() {
    if(!this.suppliers || this.suppliers.length === 0) {
      this.supplierService.getSuppliers().subscribe((suppliers: Supplier[]) => {
        this.suppliers = suppliers;
      });
    }
  }

  trackBySupplierId(index: number, supplier: Supplier): number {
    return supplier.supplierId;
  }

  selectSupplier(supplier: Supplier) {
    this.supplierSelected.emit(supplier);
  }
}
