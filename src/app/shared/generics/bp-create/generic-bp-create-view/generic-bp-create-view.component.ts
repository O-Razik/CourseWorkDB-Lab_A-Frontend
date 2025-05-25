import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {BpCreateTabComponent} from '../bp-create-tab/bp-create-tab.component';

@Component({
  selector: 'app-generic-bp-create-view',
  imports: [MatIcon, BpCreateTabComponent],
  templateUrl: './generic-bp-create-view.component.html',
  styleUrl: './generic-bp-create-view.component.css',
  standalone: true,
})
export class GenericBpCreateViewComponent {
  @Input() title: string = 'Створення замовлення';
  @Input() totalPrice: number = 0;
  @Input() canCreateOrder: boolean = false;
  @Input() showConfirmation = false;
  @Input() activeTab: string = '';
  @Input() checkout_title: string = "До сплати";
  @Input() checkout_subtitle: string = this.totalPrice + " грн";

  @Output() orderCreated = new EventEmitter<void>();
  @Output() confirmationClosed = new EventEmitter<void>();
  @Output() tabChanged = new EventEmitter<string>();

  setTab(tabId: string) {
    this.tabChanged.emit(tabId);
  }

  createOrder() {
    if (this.canCreateOrder) {
      this.orderCreated.emit();
      this.showConfirmation = true;
    }
  }

  closeConfirmation() {
    this.confirmationClosed.emit();
  }
}
