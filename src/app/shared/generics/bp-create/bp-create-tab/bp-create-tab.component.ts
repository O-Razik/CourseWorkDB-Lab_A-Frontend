import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bp-create-tab',
  imports: [],
  templateUrl: './bp-create-tab.component.html',
  styleUrl: './bp-create-tab.component.css',
  standalone: true,
})
export class BpCreateTabComponent {
  @Input() tabId: string = '';
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() hasContent: boolean = false;

  @Output() activated = new EventEmitter<string>();

  isActive: boolean = false;

  activate() {
    this.activated.emit(this.tabId);
  }
}
