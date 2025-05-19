import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import {Biomaterial} from '../models/biomaterial';

@Injectable({
  providedIn: 'root'
})
export class BiomaterialService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.apiUrl}/Biomaterial`;

  getAllBiomaterials(): Observable<Biomaterial[]> {
    return this.http.get<Biomaterial[]>(`${this.baseUrl}/all`);
  }

  getBiomaterialById(id: number): Observable<Biomaterial> {
    return this.http.get<Biomaterial>(`${this.baseUrl}/biomaterials/${id}`);
  }

  addBiomaterial(biomaterial: Biomaterial): Observable<Biomaterial> {
    return this.http.post<Biomaterial>(`${this.baseUrl}/biomaterials`, biomaterial);
  }

  updateBiomaterial(id: number, biomaterial: Biomaterial): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/biomaterials/${id}`, biomaterial);
  }
}
