import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { environment } from '../environments/environment';
import { InventoryInOrder } from '../models/inventory-in-order';

@Injectable({
  providedIn: 'root'
})
export class InventoryInOrderService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = environment.apiUrl + '/InventoryInOrder';

  // Get all inventory items for an order
  getInventoryInOrdersByOrderId(orderId: number): Observable<InventoryInOrder[]> {
    return this.http.get<InventoryInOrder[]>(`${this.baseUrl}/${orderId}/InventoryInOrder`);
  }

  // Get single inventory item in order
  getInventoryInOrder(id: number): Observable<InventoryInOrder> {
    return this.http.get<InventoryInOrder>(`${this.baseUrl}/InventoryInOrder/${id}`);
  }

  // Create new inventory item in order
  createInventoryInOrder(item: InventoryInOrder): Observable<InventoryInOrder> {
    return this.http.post<InventoryInOrder>(`${this.baseUrl}/InventoryInOrder`, item);
  }

  // Update existing inventory item in order
  updateInventoryInOrder(item: InventoryInOrder): Observable<InventoryInOrder> {
    return this.http.put<InventoryInOrder>(`${this.baseUrl}/InventoryInOrder`, item);
  }

  // Delete inventory item from order
  deleteInventoryInOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/InventoryInOrder/${id}`);
  }
}
