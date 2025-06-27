import { Component } from '@angular/core';
import {
  DashboardCard,
  GenericDashboardComponent
} from '../../shared/generics/generic-dashboard/generic-dashboard.component';

@Component({
  selector: 'app-i-manager-dashboard',
  imports: [
    GenericDashboardComponent
  ],
  templateUrl: './i-manager-dashboard.component.html',
  styleUrl: './i-manager-dashboard.component.css',
  standalone: true,
})
export class IManagerDashboardComponent {
  columns: number = 3;
  cards: DashboardCard[] = [
    {
      title: 'Замовлення запасів',
      cols: 1,
      rows: 2,
      content: 'Управління замовленнями запасів',
      icon: 'inventory',
      route: '/i-manager/inventory-orders'
    },
    {
      title: 'Лабораторні запаси',
      cols: 2,
      rows: 1,
      content: 'Перегляд лабораторних запасів',
      icon: 'science',
      route: '/i-manager/laboratory-inventory'
    },
    {
      title: 'Інвентар',
      cols: 1,
      rows: 1,
      content: 'Управління загальними типами інвентаря',
      icon: 'vaccines',
      route: '/i-manager/inventory'
    },
    {
      title: 'Лабораторії',
      cols: 1,
      rows: 1,
      content: 'Перегляд лабораторій',
      icon: 'store',
      route: '/i-manager/laboratories'
    },
  ];

}
