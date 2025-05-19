import { Component, Input, Output, EventEmitter } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SidenavItem} from '../../../data/helpers/sidenav-item';
import {AuthService} from '../../../data/services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Input() isOpen = false;
  @Input() role = '';
  @Input() items: SidenavItem[] = [];
  @Output() navigate = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  get filteredItems(): SidenavItem[] {
    return this.items;
  }

  onNavigate() {
    this.navigate.emit();
  }

  onLogout() {
    this.authService.logout();
    this.navigate.emit(); // Close the sidenav after logout
  }
}
