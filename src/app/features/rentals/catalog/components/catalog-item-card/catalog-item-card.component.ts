import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Item } from 'src/app/features/stocks/items/models/Item';

@Component({
  selector: 'app-catalog-item-card',
  templateUrl: './catalog-item-card.component.html',
  styleUrls: ['./catalog-item-card.component.css'],
})
export class CatalogItemCardComponent {
  @Input() item!: Item;
  @Input() imageUrl?: SafeUrl;
  @Output() details = new EventEmitter<Item>();

  openDetails(): void {
    this.details.emit(this.item);
  }
}
