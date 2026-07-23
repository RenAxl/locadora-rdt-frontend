import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

import { StockMovementInsertDTO } from '../dtos/stock-movement-insert.dto';
import { StockMovementDTO } from '../dtos/stock-movement.dto';

@Injectable({
  providedIn: 'root',
})
export class StockMovementService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<StockMovementDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<StockMovementDTO>>(
      API.RENTAL.STOCK_MOVEMENTS.ROOT,
      { params },
    );
  }

  insert(dto: StockMovementInsertDTO): Observable<StockMovementDTO> {
    return this.http.post<StockMovementDTO>(
      API.RENTAL.STOCK_MOVEMENTS.ROOT,
      dto,
    );
  }
}
