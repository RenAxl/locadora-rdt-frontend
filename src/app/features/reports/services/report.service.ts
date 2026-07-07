import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';

import { ReportFilterDTO } from '../dtos/report-filter.dto';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  generate(reportType: string, format: string, filters: ReportFilterDTO): Observable<Blob> {
    const params = this.buildParams(filters);

    return this.http.get(API.REPORTS.GENERATE(reportType, format), {
      params,
      responseType: 'blob',
    });
  }

  voucher(accountType: string, accountId: number, format: string): Observable<Blob> {
    return this.http.get(API.REPORTS.VOUCHER(accountType, accountId, format), {
      responseType: 'blob',
    });
  }

  download(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  openPdf(blob: Blob): void {
    const pdf = new Blob([blob], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(pdf);
    window.open(url, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(url), 60000);
  }

  private buildParams(filters: ReportFilterDTO): HttpParams {
    let params = new HttpParams();
    params = this.appendParam(params, 'search', filters.search);
    params = this.appendParam(params, 'startDate', filters.startDate);
    params = this.appendParam(params, 'endDate', filters.endDate);
    params = this.appendParam(params, 'status', filters.status);
    params = this.appendParam(params, 'periodType', filters.periodType);
    params = this.appendParam(params, 'customerId', filters.customerId);
    params = this.appendParam(params, 'supplierId', filters.supplierId);
    params = this.appendParam(params, 'employeeId', filters.employeeId);
    params = this.appendParam(params, 'paymentMethodId', filters.paymentMethodId);
    params = this.appendParam(params, 'minimumAmount', filters.minimumAmount);
    params = this.appendParam(params, 'maximumAmount', filters.maximumAmount);
    params = this.appendParam(params, 'year', filters.year);
    return params;
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
