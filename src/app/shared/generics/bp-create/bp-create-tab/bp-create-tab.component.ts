import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bp-create-tab',
  templateUrl: './bp-create-tab.component.html',
  styleUrls: ['./bp-create-tab.component.css'],
  standalone: true
})
export class BpCreateTabComponent {
  @Input() tabId: string = '';
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() hasContent: boolean = false;
  @Input() isActive: boolean = false;
  @Input() isCheckout: boolean = false;

  @Output() activated = new EventEmitter<string>();

  activate() {
    this.activated.emit(this.tabId);
  }
}
