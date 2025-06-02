import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BiomaterialCollection} from '../../../../../data/models/biomaterial-collection';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-biomaterial-collection-view',
  imports: [
    DatePipe
  ],
  templateUrl: './biomaterial-collection-view.component.html',
  styleUrl: './biomaterial-collection-view.component.css',
  standalone: true,
})
export class BiomaterialCollectionViewComponent {
  @Input() biomaterialCollection!: BiomaterialCollection;
  @Output() selected = new EventEmitter<BiomaterialCollection>();

  OnBiomaterialCollectionClick() {
    this.selected.emit(this.biomaterialCollection);
  }
}
