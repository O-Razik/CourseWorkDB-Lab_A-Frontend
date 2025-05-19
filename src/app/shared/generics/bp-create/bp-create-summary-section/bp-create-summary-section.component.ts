import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-bp-create-summary-section',
  imports: [],
  templateUrl: './bp-create-summary-section.component.html',
  styleUrl: './bp-create-summary-section.component.css',
  standalone: true,
})
export class BpCreateSummarySectionComponent {
  @Input() title: string = '';
}
