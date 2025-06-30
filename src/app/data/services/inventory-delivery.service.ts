import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { InventoryDelivery } from '../models/inventory-delivery';
import {  InventoryDeliveryFilter } from '../filters/inventory-delivery-filter';
import {InventoryInOrder} from '../models/inventory-in-order';

@Injectable({
  providedIn: 'root'
})
export class InventoryDeliveryService {
  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = environment.apiUrl + '/InventoryDelivery';

  getAllInventoryDeliveries(
    filter : InventoryDeliveryFilter
  ): Observable<InventoryDelivery[]> {
    let params = new HttpParams();

    // Set default pagination if not provided
    const pageNumber = filter.pageNumber || 1;
    const pageSize = filter.pageSize || 10;

    params = params.set('pageNumber', pageNumber.toString());
    params = params.set('pageSize', pageSize.toString());

    // Add optional filters
    if (filter.fromDate) {
      params = params.set('fromDate', filter.fromDate.toISOString());
    }
    if (filter.toDate) {
      params = params.set('toDate', filter.toDate.toISOString());
    }
    if (filter.laboratoryId) {
      params = params.set('laboratoryId', filter.laboratoryId.toString());
    }
    if (filter.inventoryIds) {
      filter.inventoryIds.forEach(id => {
        params = params.append('inventoryIds', id.toString());
      });
    }
    if (filter.statusIds) {
      filter.statusIds.forEach(id => {
        params = params.append('statusIds', id.toString());
      });
    }
    if (filter.search) {
      params = params.set('search', filter.search);
    }

    return this.http.get<InventoryDelivery[]>(`${this.baseUrl}/all`, { params });
  }

  // Get single inventory delivery by ID
  getInventoryDelivery(id: number): Observable<InventoryDelivery> {
    return this.http.get<InventoryDelivery>(`${this.baseUrl}/${id}`);
  }

  // Create new inventory delivery
  createInventoryDelivery(delivery: {
    quantity: any;
    inventoryInOrderId: number;
    statusId: number;
    inventoryInLaboratoryId: number;
    inventoryInOrder: {
      inventoryInOrderId: number;
      quantity: number;
      price: number;
      inventoryId: number;
      inventory: { price: number; inventoryName: string; inventoryId: number };
      inventoryOrderId: number
    };
    inventoryInLaboratory: {
      quantity: any;
      inventoryInLaboratoryId: number;
      laboratoryId: any;
      inventoryId: number;
      inventory: { price: number; inventoryName: string; inventoryId: number };
      expirationDate: string
    };
    deliveryDate: string;
    laboratoryFullAddress: string;
    inventoryDeliveryId: number;
    expirationDate: string;
    status: { statusId: number; statusName: string }
  }): Observable<InventoryDelivery> {
    return this.http.post<InventoryDelivery>(this.baseUrl, delivery);
  }

  // Update existing inventory delivery
  updateInventoryDelivery(delivery: InventoryDelivery): Observable<InventoryDelivery> {
    return this.http.put<InventoryDelivery>(this.baseUrl, delivery);
  }

  // Update inventory delivery status
  updateInventoryDeliveryStatus(id: number, statusId: number): Observable<InventoryDelivery> {
    return this.http.patch<InventoryDelivery>(`${this.baseUrl}/${id}/status/${statusId}`, null);
  }

  // Delete inventory delivery
  deleteInventoryDelivery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
