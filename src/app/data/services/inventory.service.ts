import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Inventory } from '../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly baseUrl = `${environment.apiUrl}/Inventory`;

  constructor(private http: HttpClient) { }

  // Get all inventories
  getAllInventories(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.baseUrl}/all`);
  }

  // Get a single inventory by ID
  getInventory(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.baseUrl}/${id}`);
  }

  // Create a new inventory
  createInventory(inventoryDto: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(this.baseUrl, inventoryDto);
  }

  // Update an existing inventory
  updateInventory(inventoryDto: Inventory): Observable<Inventory> {
    return this.http.put<Inventory>(this.baseUrl, inventoryDto);
  }

  // Delete an inventory by ID
  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
