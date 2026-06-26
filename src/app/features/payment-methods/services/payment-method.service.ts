import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

import { PaymentMethodDetailsDTO } from '../dtos/payment-method-details.dto';
import { PaymentMethodInsertDTO } from '../dtos/payment-method-insert.dto';
import { PaymentMethodUpdateDTO } from '../dtos/payment-method-update.dto';
import { PaymentMethodDTO } from '../dtos/payment-method.dto';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<PaymentMethodDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<PaymentMethodDTO>>(
      API.PAYMENT_METHODS.ROOT,
      { params },
    );
  }

  insert(dto: PaymentMethodInsertDTO): Observable<PaymentMethodDTO> {
    return this.http.post<PaymentMethodDTO>(API.PAYMENT_METHODS.ROOT, dto);
  }

  findById(id: number | string): Observable<PaymentMethodDetailsDTO> {
    return this.http.get<PaymentMethodDetailsDTO>(
      API.PAYMENT_METHODS.BY_ID(id),
    );
  }

  update(dto: PaymentMethodUpdateDTO): Observable<PaymentMethodDTO> {
    return this.http.put<PaymentMethodDTO>(
      API.PAYMENT_METHODS.BY_ID(dto.id),
      dto,
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.PAYMENT_METHODS.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.PAYMENT_METHODS.DELETE_ALL, {
      body: ids,
    });
  }
}
