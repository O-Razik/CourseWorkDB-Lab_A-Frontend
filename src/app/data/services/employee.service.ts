import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { EmployeeFilter } from '../filters/employee-filter';
import { Observable } from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';
import {Position} from '../models/position';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl =`${environment.apiUrl}/Employee`;

  getEmployees(filter: EmployeeFilter): Observable<Employee[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    if (filter.search) {
      params = params.set('search', filter.search);
    }
    if (filter.laboratoryId) {
      params = params.set('laboratoryId', filter.laboratoryId.toString());
    }

    if(filter.positionIds && filter.positionIds.length > 0) {
      filter.positionIds.forEach(id => {
        params = params.append('positionIds', id.toString());
      });
    }

    return this.http.get<Employee[]>(`${this.baseUrl}/all`, { params });
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${employee.employeeId}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(`${this.baseUrl}/Position/all`);
  }

  getPositionById(id: number): Observable<Position> {
    return this.http.get<Position>(`${this.baseUrl}/Position/${id}`);
  }

  addPosition(position: Position): Observable<Position> {
    return this.http.post<Position>(`${this.baseUrl}/Position`, position);
  }

  updatePosition(position: Position): Observable<Position> {
    return this.http.put<Position>(`${this.baseUrl}/Position/${position.positionId}`, position);
  }

  deletePosition(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Position/${id}`);
  }
}
