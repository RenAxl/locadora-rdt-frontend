import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';

import { EmployeeDTO } from '../dtos/employee.dto';
import { EmployeeDetailsDTO } from '../dtos/employee-details.dto';
import { EmployeeInsertDTO } from '../dtos/employee-insert.dto';
import { EmployeeUpdateDTO } from '../dtos/employee-update.dto';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<EmployeeDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<EmployeeDTO>>(API.EMPLOYEES.ROOT, {
      params,
    });
  }

  insert(dto: EmployeeInsertDTO): Observable<EmployeeDTO> {
    return this.http.post<EmployeeDTO>(API.EMPLOYEES.ROOT, dto);
  }

  findById(id: number | string): Observable<EmployeeDetailsDTO> {
    return this.http.get<EmployeeDetailsDTO>(API.EMPLOYEES.BY_ID(id));
  }

  update(dto: EmployeeUpdateDTO): Observable<EmployeeDTO> {
    return this.http.put<EmployeeDTO>(API.EMPLOYEES.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.EMPLOYEES.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.EMPLOYEES.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(API.EMPLOYEES.CHANGE_ACTIVE(id), active);
  }

  updatePhoto(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(`${API.EMPLOYEES.BY_ID(id)}/photo`, formData);
  }

  getEmployeePhoto(id: number): Observable<Blob> {
    return this.http.get(API.EMPLOYEES.PHOTO(id), {
      responseType: 'blob',
    });
  }
}
