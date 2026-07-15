import { Injectable } from '@angular/core';
import { RentalItem } from '../models/rental';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RentalCartService {
  private readonly storageKey = 'basic-rental-items';
  private itemsSubject = new BehaviorSubject<RentalItem[]>(this.readItems());
  items$ = this.itemsSubject.asObservable();

  getItems(): RentalItem[] {
    return this.itemsSubject.value;
  }

  private readItems(): RentalItem[] {
    const savedItems = sessionStorage.getItem(this.storageKey);

    if (!savedItems) {
      return [];
    }

    try {
      return JSON.parse(savedItems) as RentalItem[];
    } catch {
      return [];
    }
  }

  addItem(item: RentalItem): void {
    const items = this.getItems();
    const existingItem = items.find((value) => value.itemId === item.itemId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      items.push(item);
    }

    sessionStorage.setItem(this.storageKey, JSON.stringify(items));
    this.itemsSubject.next([...items]);
  }

  getTotalQuantity(): number {
    return this.getItems().reduce((total, item) => total + item.quantity, 0);
  }

  clear(): void {
    sessionStorage.removeItem(this.storageKey);
    this.itemsSubject.next([]);
  }
}
