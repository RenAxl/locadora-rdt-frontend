import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { Customer } from '../models/Customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  list(pagination: Pagination, filterName: string): Observable<any> {
    let params = new HttpParams()
      .set('name', filterName)
      .set('page', pagination.page)
      .set('linesPerPage', pagination.linesPerPage)
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<any>(API.CUSTOMERS.ROOT, { params });
  }

  insert(customer: Customer): Observable<any> {
    return this.http.post<any>(API.CUSTOMERS.ROOT, customer);
  }

  updatePhoto(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(`${API.CUSTOMERS.BY_ID(id)}/photo`, formData);
  }

  findById(id: any): Observable<any> {
    return this.http.get<any>(API.CUSTOMERS.BY_ID(id));
  }

  update(customer: Customer): Observable<any> {
    if (!customer.id) {
      throw new Error('ID do usuário obrigatório para atualização.');
    }

    return this.http.put<Customer>(API.CUSTOMERS.BY_ID(customer.id), customer);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(API.CUSTOMERS.BY_ID(id));
  }

  getCustomerPhoto(id: number): Observable<Blob> {
    return this.http.get(API.CUSTOMERS.PHOTO(id), {
      responseType: 'blob',
    });
  }

  deleteAll(ids: number[]): Observable<void> {
    console.log(ids);

    return this.http.delete<void>(API.CUSTOMERS.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    console.log(id, active);
    return this.http.patch<void>(API.CUSTOMERS.CHANGE_ACTIVE(id), active);
  }
}
