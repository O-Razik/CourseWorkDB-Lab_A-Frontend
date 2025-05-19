import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AnalysisCenter } from '../models/analysis-center';

@Injectable({
  providedIn: 'root'
})
export class AnalysisCenterService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = environment.apiUrl + '/AnalysisCenter';

  getAnalysisCenters(): Observable<AnalysisCenter[]> {
    return this.http.get<AnalysisCenter[]>(`${this.baseUrl}/all`);
  }

  getAnalysisCenterById(id: number): Observable<AnalysisCenter> {
    return this.http.get<AnalysisCenter>(`${this.baseUrl}/${id}`);
  }

  createAnalysisCenter(analysisCenter: AnalysisCenter): Observable<AnalysisCenter> {
    return this.http.post<AnalysisCenter>(this.baseUrl, analysisCenter);
  }

  updateAnalysisCenter(analysisCenter: AnalysisCenter): Observable<AnalysisCenter> {
    return this.http.put<AnalysisCenter>(`${this.baseUrl}/${analysisCenter.analysisCenterId}`, analysisCenter);
  }

  deleteAnalysisCenter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
