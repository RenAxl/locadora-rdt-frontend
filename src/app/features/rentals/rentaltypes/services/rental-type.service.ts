import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

import { RentalTypeDetailsDTO } from '../dtos/rental-type-details.dto';
import { RentalTypeInsertDTO } from '../dtos/rental-type-insert.dto';
import { RentalTypeUpdateDTO } from '../dtos/rental-type-update.dto';
import { RentalTypeDTO } from '../dtos/rental-type.dto';

@Injectable({
  providedIn: 'root',
})
export class RentalTypeService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<RentalTypeDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<RentalTypeDTO>>(
      API.RENTAL.RENTAL_TYPES.ROOT,
      { params },
    );
  }

  insert(dto: RentalTypeInsertDTO): Observable<RentalTypeDTO> {
    return this.http.post<RentalTypeDTO>(API.RENTAL.RENTAL_TYPES.ROOT, dto);
  }

  findById(id: number | string): Observable<RentalTypeDetailsDTO> {
    return this.http.get<RentalTypeDetailsDTO>(
      API.RENTAL.RENTAL_TYPES.BY_ID(id),
    );
  }

  update(dto: RentalTypeUpdateDTO): Observable<RentalTypeDTO> {
    return this.http.put<RentalTypeDTO>(
      API.RENTAL.RENTAL_TYPES.BY_ID(dto.id),
      dto,
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.RENTAL.RENTAL_TYPES.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.RENTAL.RENTAL_TYPES.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(
      API.RENTAL.RENTAL_TYPES.CHANGE_ACTIVE(id),
      active,
    );
  }
}
