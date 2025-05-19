import {Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {JsonPipe, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-generic-sub-list-view',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    JsonPipe
  ],
  templateUrl: './generic-sub-list-view.component.html',
  styleUrl: './generic-sub-list-view.component.css',
  standalone: true,
})
export class GenericSubListViewComponent<T> {
  @Input() items: T[] = [];

  @ContentChild('itemListTemplate') itemListTemplate?: TemplateRef<any>;
  @Input() trackByFn: (index: number, item: T) => any = (index, _) => index;

  emptyListMessage: string = 'Нічого не знайдено';
}
