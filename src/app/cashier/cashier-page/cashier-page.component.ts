import { Component } from '@angular/core';
import {GenericPageComponent} from '../../shared/generics/generic-page/generic-page.component';
import {SidenavItem} from '../../data/helpers/sidenav-item';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Component({
  selector: 'app-cashier-page',
  imports: [
    GenericPageComponent
  ],
  templateUrl: './cashier-page.component.html',
  styleUrl: './cashier-page.component.css',
  standalone: true,
})
export class CashierPageComponent {
  pageName: string = 'Касир';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Update page title based on active route
        const route = this.router.routerState.snapshot.root.firstChild?.firstChild;
        this.pageName = route?.data['title'] || 'Панель касира'; // does not work
      });
  }

  sidenavItems: SidenavItem[] = [
    {
      title: 'Аналізи',
      icon: 'biotech',
      path: '/cashier/analyses'
    },
    {
      title: 'Замовлення',
      icon: 'receipt_long',
      path: '/cashier/client-orders'
    },
    {
      title: 'Лабораторії',
      icon: 'store',
      path: '/cashier/laboratories'
    },
    /*
    {
      title: 'Результати аналізів',
      icon: 'assignment',
      path: '/cashier/analysis-results'
    },
    */
    {
      title: 'Лабораторні запаси',
      icon: 'inventory',
      path: '/cashier/laboratory-inventory'
    },
    {
      title: 'Клієнти',
      icon: 'people',
      path: '/cashier/clients'
    }
  ];

}
