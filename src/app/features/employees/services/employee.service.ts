import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { Employee } from '../models/Employee';
import { EmployeeInsertDTO } from '../dtos/EmployeeInsertDTO';
import { EmployeeUpdateDTO } from '../dtos/EmployeeUpdateDTO';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  list(pagination: Pagination, filterName: string): Observable<any> {
    let params = new HttpParams()
      .set('name', filterName)
      .set('page', pagination.page)
      .set('linesPerPage', pagination.linesPerPage)
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<any>(API.EMPLOYEES.ROOT, { params });
  }

  insert(employee: EmployeeInsertDTO): Observable<any> {
    return this.http.post<any>(API.EMPLOYEES.ROOT, employee);
  }

  updatePhoto(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(`${API.EMPLOYEES.BY_ID(id)}/photo`, formData);
  }

  findById(id: any): Observable<any> {
    return this.http.get<any>(API.EMPLOYEES.BY_ID(id));
  }

  update(employee: EmployeeUpdateDTO): Observable<any> {
    if (!employee.id) {
      throw new Error('ID do usuário obrigatório para atualização.');
    }

    return this.http.put<Employee>(API.EMPLOYEES.BY_ID(employee.id), employee);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(API.EMPLOYEES.BY_ID(id));
  }

  getEmployeePhoto(id: number): Observable<Blob> {
    return this.http.get(API.EMPLOYEES.PHOTO(id), {
      responseType: 'blob',
    });
  }

  deleteAll(ids: number[]): Observable<void> {
    console.log(ids);

    return this.http.delete<void>(API.EMPLOYEES.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    console.log(id, active);
    return this.http.patch<void>(API.EMPLOYEES.CHANGE_ACTIVE(id), active);
  }
}
