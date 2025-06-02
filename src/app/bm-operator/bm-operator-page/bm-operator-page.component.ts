import { Component } from '@angular/core';
import {GenericPageComponent} from '../../shared/generics/generic-page/generic-page.component';
import {SidenavItem} from '../../data/helpers/sidenav-item';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Component({
  selector: 'app-bm-operator-page',
  imports: [
    GenericPageComponent
  ],
  templateUrl: './bm-operator-page.component.html',
  styleUrl: './bm-operator-page.component.css',
  standalone: true,
})
export class BmOperatorPageComponent {
  pageName: string = 'Оператор біоматеріалів';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Update page title based on active route
        const route = this.router.routerState.snapshot.root.firstChild?.firstChild;
        this.pageName = route?.data['title'] || 'Панель транспортера біоматеріалів'; // does not work
      });
  }

  sidenavItems: SidenavItem[] = [
    {
      path: '/bm-operator/biomaterial-deliveries',
      title: 'Доставки біоматеріалів',
      icon: 'local_shipping'
    },
    {
      path: '/bm-operator/biomaterial-collections',
      title: 'Збір біоматеріалів',
      icon: 'content_paste'
    },
    {
      path: '/bm-operator/laboratories',
      title: 'Лабораторії',
      icon: 'store'
    }
  ];

}
