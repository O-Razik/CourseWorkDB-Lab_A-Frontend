import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../data/services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-auth-page',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    FormsModule,
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
  standalone: true,
})
export class AuthPageComponent {
  // Login fields
  loginEmail = '';
  loginPassword = '';

  // Signup fields
  signupEmail = '';
  signupPassword = '';

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogin() {
    if (!this.loginEmail || !this.loginPassword) {
      this.showError('Будь ласка, заповніть усі поля для входу');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (response) => {
        this.redirectBasedOnRole(response.employee.position.positionName);
      },
      error: (err) => {
        this.isLoading = false;
        this.showError('Невірний email або пароль');
      }
    });
  }

  onSignup() {
    if (!this.signupEmail || !this.signupPassword) {
      this.showError('Будь ласка, заповніть усі поля для реєстрації');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.signupEmail, this.signupPassword)
      .subscribe({
        next: (response) => {
          this.redirectBasedOnRole(response.employee.position.positionName);
        },
        error: (err) => {
          this.isLoading = false;
          this.showError('Помилка реєстрації: ' + (err.error?.message || 'Спробуйте пізніше'));
        }
      });
  }

  private redirectBasedOnRole(roleName: string): void {
    let route: string;

    switch (roleName) {
      case 'Адміністратор':
        route = '/admin/dashboard';
        break;
      case 'Реєстратор-касир':
        route = '/cashier/dashboard';
        break;
      case 'Менеджер інвентаря':
        route = '/i-manager/dashboard';
        break;
      case 'Транспортер біоматеріалів':
        route = '/bm-operator/dashboard';
        break;
      default:
        route = '/auth';
        this.showError('Невідома роль користувача');
    }

    this.router.navigate([route]);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Закрити', {
      duration: 10000000,
      panelClass: ['error-snackbar'],
    });
  }
}
