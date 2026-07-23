import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

import { CategoryDetailsDTO } from '../dtos/category-details.dto';
import { CategoryInsertDTO } from '../dtos/category-insert.dto';
import { CategoryUpdateDTO } from '../dtos/category-update.dto';
import { CategoryDTO } from '../dtos/category.dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<CategoryDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<CategoryDTO>>(
      API.RENTAL.CATEGORIES.ROOT,
      { params },
    );
  }

  insert(dto: CategoryInsertDTO): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(API.RENTAL.CATEGORIES.ROOT, dto);
  }

  findById(id: number | string): Observable<CategoryDetailsDTO> {
    return this.http.get<CategoryDetailsDTO>(
      API.RENTAL.CATEGORIES.BY_ID(id),
    );
  }

  update(dto: CategoryUpdateDTO): Observable<CategoryDTO> {
    return this.http.put<CategoryDTO>(
      API.RENTAL.CATEGORIES.BY_ID(dto.id),
      dto,
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.RENTAL.CATEGORIES.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.RENTAL.CATEGORIES.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(
      API.RENTAL.CATEGORIES.CHANGE_ACTIVE(id),
      active,
    );
  }

  updateImage(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(API.RENTAL.CATEGORIES.IMAGE(id), formData);
  }

  getCategoryImage(id: number): Observable<Blob> {
    return this.http.get(API.RENTAL.CATEGORIES.IMAGE(id), {
      responseType: 'blob',
    });
  }
}
