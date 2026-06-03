import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomerDTO } from '../dtos/customer.dto';
import { PageResponse } from 'src/app/core/models/page-response';
import { CustomerInsertDTO } from '../dtos/customer-insert.dto';
import { CustomerUpdateDTO } from '../dtos/customer-update.dto';
import { CustomerDetailsDTO } from '../dtos/customer-details.dto';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<CustomerDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<CustomerDTO>>(API.CUSTOMERS.ROOT, {
      params,
    });
  }

  insert(customer: CustomerInsertDTO): Observable<CustomerDTO> {
    return this.http.post<CustomerDTO>(API.CUSTOMERS.ROOT, customer);
  }

  findById(id: number | string): Observable<CustomerDetailsDTO> {
    return this.http.get<CustomerDetailsDTO>(API.CUSTOMERS.BY_ID(id));
  }

  update(dto: CustomerUpdateDTO): Observable<CustomerDTO> {
    return this.http.put<CustomerDTO>(API.CUSTOMERS.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.CUSTOMERS.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.CUSTOMERS.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(API.CUSTOMERS.CHANGE_ACTIVE(id), active);
  }

  updatePhoto(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(`${API.CUSTOMERS.BY_ID(id)}/photo`, formData);
  }

  getCustomerPhoto(id: number): Observable<Blob> {
    return this.http.get(API.CUSTOMERS.PHOTO(id), {
      responseType: 'blob',
    });
  }
}
