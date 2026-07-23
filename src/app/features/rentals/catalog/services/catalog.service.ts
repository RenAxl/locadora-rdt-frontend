import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { ItemDetailsDTO } from '../../../stocks/items/dtos/item-details.dto';
import { ItemDTO } from '../../../stocks/items/dtos/item.dto';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
    categoryId?: number | null,
  ): Observable<PageResponse<ItemDTO>> {
    let params = buildPaginationParams(pagination, 'name', filterName);

    if (categoryId != null) {
      params = params.set('categoryId', String(categoryId));
    }

    return this.http.get<PageResponse<ItemDTO>>(API.CATALOG.ROOT, {
      params,
    });
  }

  findById(id: number | string): Observable<ItemDetailsDTO> {
    return this.http.get<ItemDetailsDTO>(API.CATALOG.BY_ID(id));
  }

  getItemImage(id: number): Observable<Blob> {
    return this.http.get(API.CATALOG.IMAGE(id), {
      responseType: 'blob',
    });
  }
}
