import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';

import { InventoryReportFilterDTO } from '../dtos/inventory-report-filter.dto';

@Injectable({
  providedIn: 'root',
})
export class InventoryReportService {
  constructor(private http: HttpClient) {}

  generate(
    reportType: string,
    format: string,
    filters: InventoryReportFilterDTO,
  ): Observable<Blob> {
    const params = this.buildParams(filters);

    return this.http.get(API.INVENTORY_REPORTS.GENERATE(reportType, format), {
      params,
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

  private buildParams(filters: InventoryReportFilterDTO): HttpParams {
    let params = new HttpParams();
    params = this.appendParam(params, 'startDate', filters.startDate);
    params = this.appendParam(params, 'endDate', filters.endDate);
    params = this.appendParam(params, 'itemId', filters.itemId);
    params = this.appendParam(params, 'movementType', filters.movementType);
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
