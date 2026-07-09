import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

import { StockBalanceDetailsDTO } from '../../dtos/stock/stock-balance-details.dto';
import { StockBalanceUpdateDTO } from '../../dtos/stock/stock-balance-update.dto';
import { StockBalanceDTO } from '../../dtos/stock/stock-balance.dto';

@Injectable({
  providedIn: 'root',
})
export class StockBalanceService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<StockBalanceDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<StockBalanceDTO>>(
      API.RENTAL.STOCK_BALANCES.ROOT,
      { params },
    );
  }

  findById(id: number | string): Observable<StockBalanceDetailsDTO> {
    return this.http.get<StockBalanceDetailsDTO>(
      API.RENTAL.STOCK_BALANCES.BY_ID(id),
    );
  }

  update(dto: StockBalanceUpdateDTO): Observable<StockBalanceDTO> {
    return this.http.put<StockBalanceDTO>(
      API.RENTAL.STOCK_BALANCES.BY_ID(dto.id),
      dto,
    );
  }
}
