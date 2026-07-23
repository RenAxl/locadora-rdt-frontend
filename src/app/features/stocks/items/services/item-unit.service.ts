import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';

import { ItemUnit } from '../models/ItemUnit';

@Injectable({ providedIn: 'root' })
export class ItemUnitService {
  constructor(private http: HttpClient) {}

  listByItem(itemId: number): Observable<ItemUnit[]> {
    return this.http.get<ItemUnit[]>(API.RENTALS.ITEM_UNITS(itemId));
  }
}
