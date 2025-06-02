import { Component } from '@angular/core';
import {
  DashboardCard,
  GenericDashboardComponent
} from '../../shared/generics/generic-dashboard/generic-dashboard.component';

@Component({
  selector: 'app-bm-operator-dashboard',
  imports: [
    GenericDashboardComponent
  ],
  templateUrl: './bm-operator-dashboard.component.html',
  standalone: true,
  styleUrl: './bm-operator-dashboard.component.css'
})
export class BmOperatorDashboardComponent {
  columns: number = 4;
  cards: DashboardCard[];

  constructor() {
    this.cards = [
      {
        title: 'Доставки біоматеріалів',
        cols: 2,
        rows: 1,
        content: 'Управління доставками біоматеріалів',
        icon: 'local_shipping',
        route: '/bm-operator/biomaterial-deliveries'
      },
      {
        title: 'Збір біоматеріалів',
        cols: 1,
        rows: 1,
        content: 'Управління збором біоматеріалів',
        icon: 'content_paste',
        route: '/bm-operator/biomaterial-collections'
      },
      {
        title: 'Лабораторії',
        cols: 1,
        rows: 1,
        content: 'Перегляд лабораторій',
        icon: 'store',
        route: '/bm-operator/laboratories'
      }
    ];
  }

}
