import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  addAnalysis(analysis: Analysis): Observable<Analysis> {
    return this.http.post<Analysis>(`${this.baseUrl}`, analysis);
  }

  updateAnalysis(analysis: Analysis): Observable<Analysis> {
    return this.http.put<Analysis>(`${this.baseUrl}`, analysis);
  }
}
