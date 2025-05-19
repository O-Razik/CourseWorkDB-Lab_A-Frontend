// price-filter.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-filter',
  standalone: true,
  imports: [CommonModule, MatSliderModule, FormsModule],
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.css']
})
export class PriceFilterComponent {
  @Input({ required: true }) sectionName: string = '';
  @Input({ required: true }) minPrice: number = 0;
  @Input({ required: true }) maxPrice: number = 9000;
  @Input({ required: true }) step: number = 10;
  @Input({ required: true }) priceRange: [number, number] = [0, 9000];
  @Output() priceRangeChange = new EventEmitter<[number, number]>();

  validatePriceRange(): void {
    this.priceRange[0] = Math.max(this.minPrice, this.priceRange[0]);
    this.priceRange[1] = Math.min(this.maxPrice, this.priceRange[1]);

    if (this.priceRange[0] > this.priceRange[1]) {
      [this.priceRange[0], this.priceRange[1]] = [this.priceRange[1], this.priceRange[0]];
    }

    this.priceRangeChange.emit(this.priceRange);
  }
}
