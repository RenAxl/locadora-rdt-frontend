import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';

import { PositionDTO } from '../dtos/position.dto';
import { PositionDetailsDTO } from '../dtos/position-details.dto';
import { PositionInsertDTO } from '../dtos/position-insert.dto';
import { PositionUpdateDTO } from '../dtos/position-update.dto';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
}

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<PositionDTO>> {
    const params = new HttpParams()
      .set('name', filterName || '')
      .set('page', String(pagination.page))
      .set('linesPerPage', String(pagination.linesPerPage))
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<PageResponse<PositionDTO>>(
      API.EMPLOYEES.POSITIONS.ROOT,
      { params },
    );
  }

  insert(dto: PositionInsertDTO): Observable<PositionDTO> {
    return this.http.post<PositionDTO>(API.EMPLOYEES.POSITIONS.ROOT, dto);
  }

  findById(id: number | string): Observable<PositionDetailsDTO> {
    return this.http.get<PositionDetailsDTO>(API.EMPLOYEES.POSITIONS.BY_ID(id));
  }

  update(id: number, dto: PositionUpdateDTO): Observable<PositionDTO> {
    return this.http.put<PositionDTO>(API.EMPLOYEES.POSITIONS.BY_ID(id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.EMPLOYEES.POSITIONS.BY_ID(id));
  }
}
