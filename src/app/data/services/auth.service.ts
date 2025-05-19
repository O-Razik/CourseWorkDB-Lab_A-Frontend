import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import {AuthResponse} from '../models/auth';
import {UserRole} from '../models/user-role';
import {Employee} from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/login`, { email, password }).pipe(
      tap(response => {
        this.storeAuthData(response);
      })
    );
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/register`, {
      email,
      password
    }).pipe(
      tap(response => {
        this.storeAuthData(response);
      })
    );
  }

  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(response));
    localStorage.setItem('token', response.token);
    this.currentUserSubject.next(response);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getCurrentUserRole(): UserRole | null {
    const user = this.currentUserSubject.value;
    if (!user) return null;

    // Map database position names to enum values
    switch(user.employee.position.positionName) {
      case 'Адміністратор':
        return UserRole.ADMIN;
      case 'Реєстратор-касир':
        return UserRole.CASHIER;
      case 'Менеджер інвентаря':
        return UserRole.INVENTORY_MANAGER;
      case 'Транспортер біоматеріалів':
        return UserRole.BIOMATERIAL_OPERATOR;
      default:
        return null;
    }
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  getCurrentEmployee(): Employee | null {
    const user = this.currentUserSubject.value;
    return user ? user.employee : null;
  }
}
