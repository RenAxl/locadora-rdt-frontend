import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';

import {
  ReceivableDTO,
  ReceivableInstallmentDTO,
  ReceivablePaymentDTO,
  ReceivableReportDTO,
} from '../dtos/receivable.dto';
import { ReceivableDetailsDTO } from '../dtos/receivable-details.dto';
import { ReceivableInsertDTO } from '../dtos/receivable-insert.dto';
import { ReceivableUpdateDTO } from '../dtos/receivable-update.dto';

export interface ReceivableFilters {
  search?: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: string;
  dateType?: string;
  periodType?: string;
  customerId?: number | null;
  paymentMethodId?: number | null;
  paymentFrequencyId?: number | null;
  minimumAmount?: number | null;
  maximumAmount?: number | null;
  reference?: string | null;
  orderBy?: string;
  direction?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReceivableService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filters: ReceivableFilters,
  ): Observable<PageResponse<ReceivableDTO>> {
    let params = new HttpParams()
      .set('page', String(pagination.page))
      .set('linesPerPage', String(pagination.linesPerPage))
      .set('direction', filters.direction || String(pagination.direction))
      .set('orderBy', filters.orderBy || String(pagination.orderBy));

    params = this.appendParam(params, 'search', filters.search || filters.description);
    params = this.appendParam(params, 'status', filters.status);
    params = this.appendParam(params, 'periodType', filters.periodType || filters.dateType);

    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }

    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    params = this.appendParam(params, 'customerId', filters.customerId);
    params = this.appendParam(params, 'paymentMethodId', filters.paymentMethodId);
    params = this.appendParam(params, 'paymentFrequencyId', filters.paymentFrequencyId);
    params = this.appendParam(params, 'minimumAmount', filters.minimumAmount);
    params = this.appendParam(params, 'maximumAmount', filters.maximumAmount);
    params = this.appendParam(params, 'reference', filters.reference);

    return this.http.get<PageResponse<ReceivableDTO>>(API.RECEIVABLES.ROOT, {
      params,
    });
  }

  insert(dto: ReceivableInsertDTO): Observable<ReceivableDTO> {
    return this.http.post<ReceivableDTO>(API.RECEIVABLES.ROOT, dto);
  }

  findById(id: number | string): Observable<ReceivableDetailsDTO> {
    return this.http.get<ReceivableDetailsDTO>(API.RECEIVABLES.BY_ID(id));
  }

  update(dto: ReceivableUpdateDTO): Observable<ReceivableDTO> {
    return this.http.put<ReceivableDTO>(API.RECEIVABLES.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.RECEIVABLES.BY_ID(id));
  }

  pay(id: number, dto: ReceivablePaymentDTO): Observable<ReceivableDTO> {
    return this.http.post<ReceivableDTO>(API.RECEIVABLES.PAY(id), dto);
  }

  installment(
    id: number,
    dto: ReceivableInstallmentDTO,
  ): Observable<ReceivableDTO[]> {
    return this.http.post<ReceivableDTO[]>(
      API.RECEIVABLES.INSTALLMENTS(id),
      dto,
    );
  }

  report(filters: ReceivableFilters): Observable<ReceivableReportDTO> {
    let params = new HttpParams()
      .set('description', filters.description || '')
      .set('status', filters.status || 'all')
      .set('dateType', filters.dateType || 'due');

    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }

    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    return this.http.get<ReceivableReportDTO>(API.RECEIVABLES.REPORT, {
      params,
    });
  }

  receipt(id: number): Observable<string> {
    return this.http.get(API.RECEIVABLES.RECEIPT(id), {
      responseType: 'text',
    });
  }

  private appendParam(
    params: HttpParams,
    key: string,
    value?: string | number | null,
  ): HttpParams {
    if (value === null || value === undefined || value === '') {
      return params;
    }

    return params.set(key, String(value));
  }
}
