import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = `${environment.apiUrl}/Status`;

  getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(`${this.baseUrl}/all`);
  }

  getStatusById(id: number): Observable<Status> {
    return this.http.get<Status>(`${this.baseUrl}/${id}`);
  }
}
