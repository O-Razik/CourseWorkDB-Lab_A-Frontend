import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { Laboratory } from '../models/laboratory';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.apiUrl}/Laboratory`;

  getLaboratories(): Observable<Laboratory[]> {
    return this.http.get<Laboratory[]>(`${this.baseUrl}/all`).pipe(
      map(laboratories => laboratories.map(lab => ({
        ...lab,
        laboratorySchedules: lab.laboratorySchedules || []
      })))
    );
  }

  getLaboratoryById(id: number): Observable<Laboratory> {
    return this.http.get<Laboratory>(`${this.baseUrl}/${id}`);
  }

  addLaboratory(laboratory: Laboratory): Observable<Laboratory> {
    return this.http.post<Laboratory>(this.baseUrl, laboratory);
  }

  updateLaboratory(laboratory: Laboratory): Observable<Laboratory> {
    return this.http.put<Laboratory>(`${this.baseUrl}/${laboratory.laboratoryId}`, laboratory);
  }

  deleteLaboratory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
