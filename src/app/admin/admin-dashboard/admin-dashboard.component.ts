import { Component } from '@angular/core';
import {
  DashboardCard,
  GenericDashboardComponent
} from '../../shared/generics/generic-dashboard/generic-dashboard.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    GenericDashboardComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  standalone: true,
})
export class AdminDashboardComponent {
  columns: number = 5;
  cards : DashboardCard[] = [
    {
      title: 'Аналізи',
      cols: 1,
      rows: 1,
      content: 'Управління лабораторними аналізами',
      icon: 'biotech',
      route: '/admin/analyses'
    },
    {
      title: 'Лабораторії',
      cols: 1,
      rows: 1,
      content: 'Перегляд та управління лабораторіями',
      icon: 'store',
      route: '/admin/laboratories'
    },
    {
      title: 'Замовлення клієнтів',
      cols: 1,
      rows: 1,
      content: 'Управління клієнтськими замовленнями',
      icon: 'receipt_long',
      route: '/admin/client-orders'
    },
    {
      title: 'Співробітники',
      cols: 1,
      rows: 1,
      content: 'Управління обліковими записами співробітників',
      icon: 'badge',
      route: '/admin/employees'
    },
    {
      title: 'Клієнти',
      cols: 1,
      rows: 1,
      content: 'Управління інформацією про клієнтів',
      icon: 'people',
      route: '/admin/clients'
    },
    {
      title: 'Результати аналізів',
      cols: 1,
      rows: 1,
      content: 'Перегляд та управління результатами тестів',
      icon: 'assignment_turned_in',
      route: '/admin/analysis-results'
    },
    {
      title: 'Інвентар',
      cols: 1,
      rows: 1,
      content: 'Управління загальними типами інвентаря',
      icon: 'vaccines',
      route: '/admin/inventory'
    },
    {
      title: 'Лабораторні запаси',
      cols: 1,
      rows: 1,
      content: 'Управління лабораторними матеріалами',
      icon: 'science',
      route: '/admin/laboratory-inventory'
    },
    {
      title: 'Замовлення запасів',
      cols: 1,
      rows: 1,
      content: 'Управління замовленнями матеріалів',
      icon: 'inventory',
      route: '/admin/inventory-orders'
    },
    {
      title: 'Збори біоматеріалів',
      cols: 1,
      rows: 1,
      content: 'Управління зборами зразків',
      icon: 'coronavirus',
      route: '/admin/biomaterial-collections'
    },
    {
      title: 'Доставки біоматеріалів',
      cols: 1,
      rows: 1,
      content: 'Відстеження доставок зразків',
      icon: 'local_shipping',
      route: '/admin/biomaterial-deliveries'
    }
  ];

}


