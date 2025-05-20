import {Component, EventEmitter, Input, Output, signal} from '@angular/core';

@Component({
  selector: 'app-bp-create-order-summary',
  imports: [],
  templateUrl: './bp-create-order-summary.component.html',
  styleUrl: './bp-create-order-summary.component.css',
  standalone: true,
})
export class BpCreateOrderSummaryComponent {
  @Input() contentId: string = '';
  @Input() isActive: boolean = false;
  @Input() title: string = '';

  @Input() totalPrice: number = 0;
  @Input() canCreateOrder: boolean = false;
  @Output() orderCreated = new EventEmitter<void>();
  @Output() createOrder = new EventEmitter<void>();

  createOrderClicked() {
    if (this.canCreateOrder) {
      this.createOrder.emit();
    }
  }
}
