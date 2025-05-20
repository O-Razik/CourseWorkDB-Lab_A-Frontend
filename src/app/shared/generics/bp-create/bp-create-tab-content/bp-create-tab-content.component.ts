import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bp-create-tab-content',
  imports: [],
  templateUrl: './bp-create-tab-content.component.html',
  styleUrl: './bp-create-tab-content.component.css',
  standalone: true,
})
export class BpCreateTabContentComponent {
  @Input() contentId: string = '';
  @Input() isActive: boolean = false;
  @Input() title: string = '';
}
