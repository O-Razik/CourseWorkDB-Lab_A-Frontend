import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { InventoryOrder } from '../models/inventory-order';
import { InventoryInOrder } from '../models/inventory-in-order';
import {InventoryOrderFilter} from '../filters/inventory-order-filter';

@Injectable({
  providedIn: 'root'
})
export class InventoryOrderService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = environment.apiUrl + '/InventoryOrder';

  getAllInventoryOrders(filter: InventoryOrderFilter): Observable<InventoryOrder[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    if (filter.fromDate) params = params.set('fromDate', filter.fromDate.toISOString());
    if (filter.toDate) params = params.set('toDate', filter.toDate.toISOString());
    if (filter.supplierId) params = params.set('supplierId', filter.supplierId.toString());
    if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.statusIds) {
      filter.statusIds.forEach(id => params = params.append('statusIds', id.toString()));
    }
    if (filter.search) params = params.set('search', filter.search);

    return this.http.get<InventoryOrder[]>(`${this.baseUrl}/all`, { params });
  }

  // Get single inventory order by ID
  getInventoryOrder(id: number): Observable<InventoryOrder> {
    return this.http.get<InventoryOrder>(`${this.baseUrl}/${id}`);
  }

  // Create new inventory order
  createInventoryOrder(order: {
    inventoryInOrders: {
      quantity: number;
      price: number;
      inventoryId: number;
      inventory: { price: number; inventoryName: string; inventoryId: number }
    }[];
    supplierId: number;
    orderDate: string
  }): Observable<InventoryOrder> {
    return this.http.post<InventoryOrder>(this.baseUrl, order);
  }

  // Update existing inventory order
  updateInventoryOrder(order: InventoryOrder): Observable<InventoryOrder> {
    return this.http.put<InventoryOrder>(this.baseUrl, order);
  }

  // Delete inventory order
  deleteInventoryOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
