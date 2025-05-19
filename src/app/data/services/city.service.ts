import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.apiUrl}/City`;

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/all`);
  }

  getCityById(id: number): Observable<City> {
    return this.http.get<City>(`${this.baseUrl}/${id}`);
  }

  addCity(city: City): Observable<City> {
    return this.http.post<City>(this.baseUrl, city);
  }

  updateCity(city: City): Observable<City> {
    return this.http.put<City>(`${this.baseUrl}/${city.cityId}`, city);
  }

  deleteCity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
