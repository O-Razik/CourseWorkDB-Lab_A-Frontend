import { Injectable } from '@angular/core';
import { BiomaterialCollection } from '../models/biomaterial-collection';
import { HttpClient,  HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {BiomaterialCollectionFilter} from '../filters/biomaterial-collection-filter';


@Injectable({
  providedIn: 'root'
})
export class BiomaterialCollectionService {
  private apiUrl = `${environment.apiUrl}/BiomaterialCollection`;

  constructor(
    private http: HttpClient
  ) { }

  getBiomaterialCollections(filter : BiomaterialCollectionFilter): Observable<BiomaterialCollection[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    if (filter.laboratoryId) {
      params = params.set('laboratoryId', filter.laboratoryId.toString());
    }

    if (filter.fromExpirationDate) {
      params = params.set('fromExpirationDate', filter.fromExpirationDate.toISOString());
    }

    if (filter.toExpirationDate) {
      params = params.set('toExpirationDate', filter.toExpirationDate.toISOString());
    }

    if (filter.fromCollectionDate) {
      params = params.set('fromCollectionDate', filter.fromCollectionDate.toISOString());
    }

    if (filter.toCollectionDate) {
      params = params.set('toCollectionDate', filter.toCollectionDate.toISOString());
    }

    if (filter.inventoryId) {
      params = params.set('inventoryId', filter.inventoryId.toString());
    }

    if (filter.biomaterialId) {
      params = params.set('biomaterialId', filter.biomaterialId.toString());
    }

    if (filter.search) {
      params = params.set('search', filter.search);
    }

    if (filter.notDelivered) {
      params = params.set('notDelivered', filter.notDelivered.toString());
    }

    return this.http.get<BiomaterialCollection[]>(`${this.apiUrl}/all`, { params });
  }

  getBiomaterialCollectionById(id: number): Observable<BiomaterialCollection> {
    return this.http.get<BiomaterialCollection>(`${this.apiUrl}/${id}`);
  }

  createBiomaterialCollection(biomaterialCollection: BiomaterialCollection): Observable<BiomaterialCollection> {
    return this.http.post<BiomaterialCollection>(`${this.apiUrl}`, biomaterialCollection);
  }

  updateBiomaterialCollection(biomaterialCollection: BiomaterialCollection): Observable<BiomaterialCollection> {
    return this.http.put<BiomaterialCollection>(`${this.apiUrl}`, biomaterialCollection);
  }

  deleteBiomaterialCollection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
