import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { Analysis} from '../models/analysis'

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.apiUrl}/Analysis`;

  getAllAnalyses(): Observable<Analysis[]> {
    return this.http.get<Analysis[]>(`${this.baseUrl}/all`);
  }

  getAnalysisById(id: number): Observable<Analysis> {
    return this.http.get<Analysis>(`${this.baseUrl}/analyses/${id}`);
  }

  addAnalysis(analysis: Analysis): Observable<Analysis> {
    return this.http.post<Analysis>(`${this.baseUrl}/analyses`, analysis);
  }

  updateAnalysis(id: number, analysis: Analysis): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/analyses/${id}`, analysis);
  }

  deleteAnalysis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/analyses/${id}`);
  }
}
