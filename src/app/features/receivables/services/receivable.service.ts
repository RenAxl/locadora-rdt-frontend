import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

import { ReceivableDTO } from '../dtos/receivable.dto';

@Injectable({
  providedIn: 'root',
})
export class ReceivableService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterDescription: string,
  ): Observable<PageResponse<ReceivableDTO>> {
    const params = buildPaginationParams(
      pagination,
      'description',
      filterDescription,
    );

    return this.http.get<PageResponse<ReceivableDTO>>(API.RECEIVABLES.ROOT, {
      params,
    });
  }
}
