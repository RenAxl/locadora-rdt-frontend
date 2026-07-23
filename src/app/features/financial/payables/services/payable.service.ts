import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';

import {
  PayableDTO,
  PayableInstallmentDTO,
  PayablePaymentDTO,
  PayableReportDTO,
} from '../dtos/payable.dto';
import { PayableDetailsDTO } from '../dtos/payable-details.dto';
import { PayableInsertDTO } from '../dtos/payable-insert.dto';
import { PayableUpdateDTO } from '../dtos/payable-update.dto';

export interface PayableFilters {
  search?: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: string;
  dateType?: string;
  periodType?: string;
  supplierId?: number | null;
  employeeId?: number | null;
  paymentMethodId?: number | null;
  paymentFrequencyId?: number | null;
  minimumAmount?: number | null;
  maximumAmount?: number | null;
  orderBy?: string;
  direction?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PayableService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filters: PayableFilters,
  ): Observable<PageResponse<PayableDTO>> {
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

    params = this.appendParam(params, 'supplierId', filters.supplierId);
    params = this.appendParam(params, 'employeeId', filters.employeeId);
    params = this.appendParam(params, 'paymentMethodId', filters.paymentMethodId);
    params = this.appendParam(params, 'paymentFrequencyId', filters.paymentFrequencyId);
    params = this.appendParam(params, 'minimumAmount', filters.minimumAmount);
    params = this.appendParam(params, 'maximumAmount', filters.maximumAmount);

    return this.http.get<PageResponse<PayableDTO>>(API.PAYABLES.ROOT, {
      params,
    });
  }

  insert(dto: PayableInsertDTO): Observable<PayableDTO> {
    return this.http.post<PayableDTO>(API.PAYABLES.ROOT, dto);
  }

  findById(id: number | string): Observable<PayableDetailsDTO> {
    return this.http.get<PayableDetailsDTO>(API.PAYABLES.BY_ID(id));
  }

  update(dto: PayableUpdateDTO): Observable<PayableDTO> {
    return this.http.put<PayableDTO>(API.PAYABLES.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.PAYABLES.BY_ID(id));
  }

  pay(id: number, dto: PayablePaymentDTO): Observable<PayableDTO> {
    return this.http.post<PayableDTO>(API.PAYABLES.PAY(id), dto);
  }

  installment(
    id: number,
    dto: PayableInstallmentDTO,
  ): Observable<PayableDTO[]> {
    return this.http.post<PayableDTO[]>(
      API.PAYABLES.INSTALLMENTS(id),
      dto,
    );
  }

  report(filters: PayableFilters): Observable<PayableReportDTO> {
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

    return this.http.get<PayableReportDTO>(API.PAYABLES.REPORT, {
      params,
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
