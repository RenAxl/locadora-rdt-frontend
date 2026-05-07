import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';

import { DepartmentDTO } from '../dtos/department.dto';
import { DepartmentDetailsDTO } from '../dtos/department-details.dto';
import { DepartmentInsertDTO } from '../dtos/department-insert.dto';
import { DepartmentUpdateDTO } from '../dtos/department-update.dto';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<DepartmentDTO>> {
    const params = new HttpParams()
      .set('name', filterName || '')
      .set('page', String(pagination.page))
      .set('linesPerPage', String(pagination.linesPerPage))
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<PageResponse<DepartmentDTO>>(
      API.EMPLOYEES.DEPARTMENTS.ROOT,
      { params },
    );
  }

  insert(dto: DepartmentInsertDTO): Observable<DepartmentDTO> {
    return this.http.post<DepartmentDTO>(API.EMPLOYEES.DEPARTMENTS.ROOT, dto);
  }

  findById(id: number | string): Observable<DepartmentDetailsDTO> {
    return this.http.get<DepartmentDetailsDTO>(
      API.EMPLOYEES.DEPARTMENTS.BY_ID(id),
    );
  }

  update(id: number, dto: DepartmentUpdateDTO): Observable<DepartmentDTO> {
    return this.http.put<DepartmentDTO>(
      API.EMPLOYEES.DEPARTMENTS.BY_ID(id),
      dto,
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.EMPLOYEES.DEPARTMENTS.BY_ID(id));
  }
}
