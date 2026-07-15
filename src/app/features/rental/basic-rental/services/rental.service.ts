import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';
import { Pagination } from 'src/app/core/models/Pagination';
import { Rental } from '../models/rental';
import { CustomerDTO } from 'src/app/features/customers/dtos/customer.dto';

export interface RentalFilter {
  number?: string;
  customer?: string;
  status?: string;
  rentalTypeId?: number | null;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable({ providedIn: 'root' })
export class RentalService {
  constructor(private http: HttpClient) {}

  list(pagination: Pagination, filter: RentalFilter): Observable<PageResponse<Rental>> {
    let params = new HttpParams()
      .set('page', pagination.page)
      .set('linesPerPage', pagination.linesPerPage)
      .set('direction', pagination.direction)
      .set('orderBy', pagination.orderBy);

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PageResponse<Rental>>(API.RENTALS.ROOT, { params });
  }

  findById(id: number | string): Observable<Rental> {
    return this.http.get<Rental>(API.RENTALS.BY_ID(id));
  }

  findCurrentCustomer(): Observable<CustomerDTO> {
    return this.http.get<CustomerDTO>(API.RENTALS.CURRENT_CUSTOMER);
  }

  insert(rental: Rental): Observable<Rental> {
    return this.http.post<Rental>(API.RENTALS.ROOT, rental);
  }

  update(id: number, rental: Rental): Observable<Rental> {
    return this.http.put<Rental>(API.RENTALS.BY_ID(id), rental);
  }

  confirm(id: number): Observable<Rental> {
    return this.http.patch<Rental>(API.RENTALS.CONFIRM(id), {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.RENTALS.BY_ID(id));
  }
}
