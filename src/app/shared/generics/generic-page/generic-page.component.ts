import {Component, Input} from '@angular/core';
import {HeaderComponent} from '../../ui/header/header.component';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {SidenavComponent} from '../../ui/sidenav/sidenav.component';
import {SidenavItem} from '../../../data/helpers/sidenav-item';
import {filter} from 'rxjs';

@Component({
  selector: 'app-generic-page',
  imports: [
    HeaderComponent,
    RouterOutlet,
    SidenavComponent
  ],
  templateUrl: './generic-page.component.html',
  styleUrl: './generic-page.component.css',
  standalone: true,
})
export class GenericPageComponent {
  isSidenavOpen = false;

  @Input() pageName: string = '';
  @Input()  role = 'admin';
  userName = 'John Doe';
  labAddress = 'Main Laboratory';

  @Input() sidenavItems: SidenavItem[] = [];

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
