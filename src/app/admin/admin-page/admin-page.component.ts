import { Component } from '@angular/core';
import {GenericPageComponent} from '../../shared/generics/generic-page/generic-page.component';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';
import {SidenavItem} from '../../data/helpers/sidenav-item';

@Component({
  selector: 'app-admin-page',
  imports: [
    GenericPageComponent
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
  standalone: true,
})
export class AdminPageComponent {

  pageName: string = 'Панель адміністратора';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Update page title based on active route
        const route = this.router.routerState.snapshot.root.firstChild?.firstChild;
        this.pageName = route?.data['title'] || 'Admin Dashboard'; // does not work
      });
  }

  sidenavItems: SidenavItem[] = [
    {
      path: '/admin/analyses',
      title: 'Аналізи',
      icon: 'biotech'
    },
    {
      path: '/admin/laboratories',
      title: 'Лабораторії',
      icon: 'store'
    },
    {
      path: '/admin/client-orders',
      title: 'Замовлення',
      icon: 'receipt_long'
    },
    {
      path: '/admin/employees',
      title: 'Співробітники',
      icon: 'badge'
    },
    {
      path: '/admin/clients',
      title: 'Клієнти',
      icon: 'people'
    },
    /*
    {
      path: '/admin/analysis-results',
      title: 'Результати аналізів',
      icon: 'assignment_turned_in'
    },
    */
    {
      path: '/admin/laboratory-inventory',
      title: 'Лабораторні запаси',
      icon: 'science'
    },
    {
      path: '/admin/inventory-orders',
      title: 'Замовлення запасів',
      icon: 'inventory'
    },
    {
      path: '/admin/biomaterial-collections',
      title: 'Збори біоматеріалів',
      icon: 'coronavirus'
    },
    {
      path: '/admin/biomaterial-deliveries',
      title: 'Доставки біоматеріалів',
      icon: 'local_shipping'
    }
  ];
}
