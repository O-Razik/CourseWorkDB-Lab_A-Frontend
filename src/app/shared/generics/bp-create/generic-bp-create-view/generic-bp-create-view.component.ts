import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-generic-bp-create-view',
  imports: [MatIcon],
  templateUrl: './generic-bp-create-view.component.html',
  styleUrl: './generic-bp-create-view.component.css',
  standalone: true,
})
export class GenericBpCreateViewComponent {
  @Input() title: string = 'Створення замовлення';
  @Input() totalPrice: number = 0;
  @Input() canCreateOrder: boolean = false;

  @Output() orderCreated = new EventEmitter<void>();

  activeTabId: string = '';
  showConfirmation = false;

  setActiveTab(tabId: string) {
    this.activeTabId = tabId;
  }

  createOrder() {
    if (this.canCreateOrder) {
      this.orderCreated.emit();
      this.showConfirmation = true;
    }
  }

  closeConfirmation() {
    this.showConfirmation = false;
  }
}
