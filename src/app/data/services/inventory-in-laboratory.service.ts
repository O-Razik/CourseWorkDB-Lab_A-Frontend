import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { InventoryInLaboratory } from '../models/inventory-in-laboratory';

@Injectable({
  providedIn: 'root'
})
export class InventoryInLaboratoryService {
  private readonly apiUrl = `${environment.apiUrl}/Laboratory`;

  constructor(private http: HttpClient) { }

  getInventoryByLaboratory(laboratoryId: number, isZero: boolean): Observable<InventoryInLaboratory[]> {
    return this.http.get<InventoryInLaboratory[]>(`${this.apiUrl}/${laboratoryId}/Inventory/${isZero}`);
  }

  getInventoryItem(inventoryId: number): Observable<InventoryInLaboratory> {
    return this.http.get<InventoryInLaboratory>(`${this.apiUrl}/Inventory/${inventoryId}`);
  }

  createInventoryItem(inventoryItem: InventoryInLaboratory): Observable<InventoryInLaboratory> {
    return this.http.post<InventoryInLaboratory>(`${this.apiUrl}/Inventory`, inventoryItem);
  }

  updateInventoryItem(inventoryItem: InventoryInLaboratory): Observable<InventoryInLaboratory> {
    return this.http.put<InventoryInLaboratory>(`${this.apiUrl}/Inventory`, inventoryItem);
  }

  deleteInventoryItem(inventoryItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Inventory/${inventoryItemId}`);
  }
}
