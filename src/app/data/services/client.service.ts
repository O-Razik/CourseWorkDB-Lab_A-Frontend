import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Client } from '../models/client';
import { Sex } from '../models/sex'
import { ClientFilter } from '../filters/client-filter';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl =`${environment.apiUrl}/Client`;

  getClients(filter: ClientFilter): Observable<Client[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    if (filter.search) {
      params = params.set('search', filter.search);
    }
    if (filter.sexId) {
      params = params.set('sexId', filter.sexId.toString());
    }

    return this.http.get<Client[]>(`${this.baseUrl}/all`, { params });
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, client);
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getSexes() : Observable<Sex[]> {
    return this.http.get<Sex[]>(`${this.baseUrl}/Sex/all`);
  }

  getSexById(id: number) : Observable<Sex> {
    return this.http.get<Sex>(`${this.baseUrl}/Sex/${id}`);
  }
}
