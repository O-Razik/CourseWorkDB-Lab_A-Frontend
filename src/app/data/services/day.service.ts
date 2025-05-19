import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

import { Day } from '../models/day';

@Injectable({
  providedIn: 'root'
})
export class DayService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = `${environment.apiUrl}/Schedule/Day`;

  getDays(): Observable<Day[]> {
    return this.http.get<Day[]>(`${this.baseUrl}/all`);
  }

  getDayById(id: number): Observable<Day> {
    return this.http.get<Day>(`${this.baseUrl}/${id}`);
  }
}
