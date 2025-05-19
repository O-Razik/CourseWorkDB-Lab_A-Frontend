// client-view.component.ts
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../../../data/models/client';
import {OrderViewComponent} from "../order-view/order-view.component";
import {ClientOrder} from '../../../data/models/client-order';
import {ClientOrderService} from '../../../data/services/client-order.service';

@Component({
  selector: 'app-client-view',
  standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, OrderViewComponent],
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.css'],
})
export class ClientViewComponent implements OnInit{
  @Input() client!: Client;
  emptyListMessage: string = 'Клієнт не має жодного замовлення';
  cols: number = 2;

  clientOrders: ClientOrder[] = [];
  ordersStillLoading: boolean = true;
  @Input() showOrders: boolean = true;
  @Output() selected = new EventEmitter<Client>();

  constructor(
    private clientOrderService: ClientOrderService,
  ) {
    this.cols = Math.floor(window.innerWidth / 300);
  }

  ngOnInit() {
    if(this.showOrders) {
      this.loadClientOrders();
    }
    this.cols = Math.floor(window.innerWidth / 300);
  }

  loadClientOrders() {
    if (this.client) {
      this.clientOrderService.getClientOrdersByClientId(this.client.clientId).subscribe((orders) => {
        this.clientOrders = orders;
        this.ordersStillLoading = false;
      });
    }
  }

  onResize(event: any) {
    this.cols = Math.floor(event.target.innerWidth / 300);
  }

  trackByOrderId($index: number, order: ClientOrder) {
    return order.clientOrderId;
  }

  onClientClick() {
    this.selected.emit(this.client);
  }
}
