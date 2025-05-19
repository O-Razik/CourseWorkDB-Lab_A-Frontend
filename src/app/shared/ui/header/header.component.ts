import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../../data/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() role: string = '';
  @Input() pageName: string = '';
  @Output() menuClicked = new EventEmitter<void>();


  userName: string = 'John Doe';
  labAddress: string = 'Laboratory Address';
  isDashboardPage: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkIfDashboard();
    this.router.events.subscribe(() => {
      this.checkIfDashboard();
      this.updateUserInfo();
    });
    this.updateUserInfo();
  }

  private updateUserInfo(): void {
    const currentEmployee = this.authService.getCurrentEmployee();
    if (currentEmployee) {
      this.userName = `${currentEmployee.firstName} ${currentEmployee.lastName}`;

      // Set lab address if available in user data
      if (currentEmployee.laboratory?.address) {
        this.labAddress = currentEmployee.laboratory.city.cityName + ", "+ currentEmployee.laboratory.address;
      }
    }
  }

  onMenuClick() {
    this.menuClicked.emit();
  }

  checkIfDashboard() {
    const currentUrl = this.router.url.toLowerCase();
    this.isDashboardPage = currentUrl.toString().includes('/dashboard');
  }

  goBackToDashboard() {
    // Navigate to dashboard based on role
    switch(this.role.toLowerCase()) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      // Add more roles as needed
      case 'cashier':
        this.router.navigate(['/cashier/dashboard']);
        break;
      case 'i-manager':
        this.router.navigate(['/i-manager/dashboard']);
        break;
      case 'bm-operator':
        this.router.navigate(['/bm-operator/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
