import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

import { ItemDetailsDTO } from '../dtos/item-details.dto';
import { ItemInsertDTO } from '../dtos/item-insert.dto';
import { ItemUpdateDTO } from '../dtos/item-update.dto';
import { ItemDTO } from '../dtos/item.dto';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<ItemDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<ItemDTO>>(API.RENTAL.ITEMS.ROOT, {
      params,
    });
  }

  insert(dto: ItemInsertDTO): Observable<ItemDTO> {
    return this.http.post<ItemDTO>(API.RENTAL.ITEMS.ROOT, dto);
  }

  findById(id: number | string): Observable<ItemDetailsDTO> {
    return this.http.get<ItemDetailsDTO>(API.RENTAL.ITEMS.BY_ID(id));
  }

  update(dto: ItemUpdateDTO): Observable<ItemDTO> {
    return this.http.put<ItemDTO>(API.RENTAL.ITEMS.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.RENTAL.ITEMS.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.RENTAL.ITEMS.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(API.RENTAL.ITEMS.CHANGE_ACTIVE(id), active);
  }

  updateImage(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(API.RENTAL.ITEMS.IMAGE(id), formData);
  }

  getItemImage(id: number): Observable<Blob> {
    return this.http.get(API.RENTAL.ITEMS.IMAGE(id), {
      responseType: 'blob',
    });
  }
}
