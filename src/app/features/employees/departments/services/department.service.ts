import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { Department } from '../models/Department';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  list(pagination: Pagination, filterName: string): Observable<any> {
    let params = new HttpParams()
      .set('name', filterName)
      .set('page', pagination.page)
      .set('linesPerPage', pagination.linesPerPage)
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<any>(API.EMPLOYEES.DEPARTMENTS.ROOT, { params });
  }

  insert(department: Department): Observable<any> {
    return this.http.post<any>(API.EMPLOYEES.DEPARTMENTS.ROOT, department);
  }

  findById(id: number | string): Observable<any> {
    return this.http.get<any>(API.EMPLOYEES.DEPARTMENTS.BY_ID(id));
  }

  update(department: Department): Observable<any> {
    if (!department.id) {
      throw new Error('ID do usuário obrigatório para atualização.');
    }

    return this.http.put<Department>(API.EMPLOYEES.DEPARTMENTS.BY_ID(department.id), department);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(API.EMPLOYEES.DEPARTMENTS.BY_ID(id));
  }
}
