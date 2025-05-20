import {Component, Input} from '@angular/core';
import {BiomaterialCollection} from '../../../data/models/biomaterial-collection';
import {DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-biomaterial-collection-view',
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './biomaterial-collection-view.component.html',
  styleUrl: './biomaterial-collection-view.component.css',
  standalone: true,
})
export class BiomaterialCollectionViewComponent {
  @Input() biomaterialCollection!: BiomaterialCollection;
}
