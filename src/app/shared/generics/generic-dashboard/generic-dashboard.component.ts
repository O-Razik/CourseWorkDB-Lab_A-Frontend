// generic-dashboard.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {RouterLink} from '@angular/router';

export interface DashboardCard {
  title: string;
  cols: number;
  rows: number;
  content: string;
  icon?: string;
  route?: string;
}

@Component({
  selector: 'app-generic-dashboard',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './generic-dashboard.component.html',
  styleUrls: ['./generic-dashboard.component.css']
})
export class GenericDashboardComponent {
  @Input() cards: DashboardCard[] = [];
  @Input() columns = 4;
  @Input() rowHeight: string = '240';

  // Consistent color for all cards
  readonly cardColor = '#5788ec';
}
