import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {UserRole} from '../models/user-role';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<UserRole>;
    const userRole = this.authService.getCurrentUserRole();

    if (this.authService.isAuthenticated() && userRole && expectedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/auth']);
    return false;
  }
}
