import { Component } from '@angular/core';
import {
  DashboardCard,
  GenericDashboardComponent
} from '../../shared/generics/generic-dashboard/generic-dashboard.component';

@Component({
  selector: 'app-cashier-dashboard',
  imports: [
    GenericDashboardComponent
  ],
  templateUrl: './cashier-dashboard.component.html',
  styleUrl: './cashier-dashboard.component.css',
  standalone: true,
})
export class CashierDashboardComponent {
  columns: number = 4
  cards: DashboardCard[] = [
    {
      title: 'Замовлення',
      cols: 2,
      rows: 1,
      content: 'Управління клієнтськими замовленнями',
      icon: 'receipt_long',
      route: '/cashier/client-orders'
    },
    {
      title: 'Аналізи',
      cols: 1,
      rows: 1,
      content: 'Управління лабораторними аналізами',
      icon: 'biotech',
      route: '/cashier/analyses'
    },
    {
      title: 'Результати аналізів',
      cols: 1,
      rows: 2,
      content: 'Перегляд результатів аналізів',
      icon: 'assignment',
      route: '/cashier/analysis-results'
    },
    {
      title: 'Лабораторії',
      cols: 1,
      rows: 1,
      content: 'Перегляд лабораторій',
      icon: 'store',
      route: '/cashier/laboratories'
    },
    {
      title: 'Лабораторні запаси',
      cols: 1,
      rows: 1,
      content: 'Перегляд лабораторних запасів',
      icon: 'inventory',
    },
    {
      title: 'Клієнти',
      cols: 1,
      rows: 1,
      content: 'Перегляд інформації про клієнтів',
      icon: 'people',
      route: '/cashier/clients'
    }
  ];

}
