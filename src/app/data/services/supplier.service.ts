import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Supplier } from '../models/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = environment.apiUrl + '/Supplier';

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.baseUrl + '/all');
  }

  getSupplierById(supplierId: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/${supplierId}`);
  }

  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.baseUrl , supplier);
  }

  updateSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(this.baseUrl, supplier);
  }

  deleteSupplier(supplierId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${supplierId}`);
  }
}
