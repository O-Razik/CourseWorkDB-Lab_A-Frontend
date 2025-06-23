import { Component } from '@angular/core';
import {GenericPageComponent} from '../../shared/generics/generic-page/generic-page.component';
import {SidenavItem} from '../../data/helpers/sidenav-item';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Component({
  selector: 'app-i-manager-page',
  imports: [
    GenericPageComponent
  ],
  templateUrl: './i-manager-page.component.html',
  styleUrl: './i-manager-page.component.css',
  standalone: true,
})
export class IManagerPageComponent {
  pageName: string = 'Менеджер інвентаря лабораторії';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Update page title based on active route
        const route = this.router.routerState.snapshot.root.firstChild?.firstChild;
        this.pageName = route?.data['title'] || 'Менеджер інвентаря лабораторії';
      });
  }

  sidenavItems: SidenavItem[] = [
    {
      path: '/i-manager/inventory-orders',
      title: 'Замовлення запасів',
      icon: 'inventory'
    },
    {
      path: '/i-manager/laboratory-inventory',
      title: 'Лабораторні запаси',
      icon: 'science'
    },
    {
      path: '/i-manager/inventory',
      title: 'Інвентар',
      icon: 'vaccines'
    },
    {
      path: '/i-manager/laboratories',
      title: 'Лабораторії',
      icon: 'store'
    },
  ];

}
