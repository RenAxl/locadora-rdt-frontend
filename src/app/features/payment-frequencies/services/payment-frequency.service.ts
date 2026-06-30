import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

import { PaymentFrequencyDetailsDTO } from '../dtos/payment-frequency-details.dto';
import { PaymentFrequencyInsertDTO } from '../dtos/payment-frequency-insert.dto';
import { PaymentFrequencyUpdateDTO } from '../dtos/payment-frequency-update.dto';
import { PaymentFrequencyDTO } from '../dtos/payment-frequency.dto';

@Injectable({
  providedIn: 'root',
})
export class PaymentFrequencyService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterFrequency: string,
  ): Observable<PageResponse<PaymentFrequencyDTO>> {
    const params = buildPaginationParams(
      pagination,
      'frequency',
      filterFrequency,
    );

    return this.http.get<PageResponse<PaymentFrequencyDTO>>(
      API.PAYMENT_FREQUENCIES.ROOT,
      { params },
    );
  }

  insert(dto: PaymentFrequencyInsertDTO): Observable<PaymentFrequencyDTO> {
    return this.http.post<PaymentFrequencyDTO>(
      API.PAYMENT_FREQUENCIES.ROOT,
      dto,
    );
  }

  findById(id: number | string): Observable<PaymentFrequencyDetailsDTO> {
    return this.http.get<PaymentFrequencyDetailsDTO>(
      API.PAYMENT_FREQUENCIES.BY_ID(id),
    );
  }

  update(dto: PaymentFrequencyUpdateDTO): Observable<PaymentFrequencyDTO> {
    return this.http.put<PaymentFrequencyDTO>(
      API.PAYMENT_FREQUENCIES.BY_ID(dto.id),
      dto,
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.PAYMENT_FREQUENCIES.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.PAYMENT_FREQUENCIES.DELETE_ALL, {
      body: ids,
    });
  }
}
