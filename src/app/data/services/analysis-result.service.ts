import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AnalysisResult } from '../models/analysis-result';
import { AnalysisResultFilter } from '../filters/analysis-result-filter';

@Injectable({
  providedIn: 'root'
})
export class AnalysisResultService {
  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = environment.apiUrl + '/AnalysisResult';

  getAnalysisResults(filter: AnalysisResultFilter): Observable<AnalysisResult[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    if (filter.fromDate) {
      params = params.set('fromDate', filter.fromDate.toISOString());
    }
    if (filter.toDate) {
      params = params.set('toDate', filter.toDate.toISOString());
    }
    if (filter.analysisCenterId) {
      params = params.set('analysisCenterId', filter.analysisCenterId.toString());
    }
    if (filter.analysisId) {
      params = params.set('analysisId', filter.analysisId.toString());
    }
    if (filter. clientFullname) {
      params = params.set('clientFullname', filter.clientFullname);
    }

    return this.http.get<AnalysisResult[]>(`${this.baseUrl}/all`, { params });
  }

  getAnalysisResultById(id: number): Observable<AnalysisResult> {
    return this.http.get<AnalysisResult>(`${this.baseUrl}/${id}`);
  }

  createAnalysisResult(analysisResult: AnalysisResult): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(this.baseUrl, analysisResult);
  }

  updateAnalysisResult(analysisResult: AnalysisResult): Observable<AnalysisResult> {
    return this.http.put<AnalysisResult>(`${this.baseUrl}/${analysisResult.analysisResultId}`, analysisResult);
  }

  deleteAnalysisResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  downloadPdf(analysisResultId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${analysisResultId}/pdf`, {
      responseType: 'blob'
    });
  }
}
