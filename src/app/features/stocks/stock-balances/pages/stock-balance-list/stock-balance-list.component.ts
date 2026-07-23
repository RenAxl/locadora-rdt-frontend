import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';

import { StockBalanceMapper } from '../../../stock-balances/mapper/stock-balance.mapper';
import { StockBalance } from '../../../stock-balances/models/StockBalance';
import { StockBalanceService } from '../../services/stock-balance.service';

@Component({
  selector: 'app-stock-balance-list',
  templateUrl: './stock-balance-list.component.html',
  styleUrls: ['./stock-balance-list.component.css'],
})
export class StockBalanceListComponent {
  balances: StockBalance[] = [];
  pagination: Pagination = new Pagination(0, 5, 'ASC', 'item.name');
  totalElements: number = 0;
  filterName: string = '';
  constructor(
    private stockBalanceService: StockBalanceService,
    private messageService: MessageService,
  ) {}

  list(page: number = 0): void {
    this.pagination.page = page;

    this.stockBalanceService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.balances = data.content.map(StockBalanceMapper.fromDTO);
        this.totalElements = data.totalElements;
      });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event.first! / event.rows!;
    this.list(page);
  }

  searchItem(name: string): void {
    this.filterName = name;
    this.list();
  }

  updateMinimum(balance: StockBalance): void {
    if (!balance.id) return;
    const minimum = Math.max(0, Number(balance.minimumQuantity ?? 0));
    balance.minimumQuantity = minimum;

    this.stockBalanceService.updateMinimum(balance.id, minimum).subscribe({
      next: (updated) => {
        Object.assign(balance, StockBalanceMapper.fromDTO(updated));
        this.messageService.add({
          severity: 'success',
          detail: 'Estoque mínimo atualizado!',
        });
      },
      error: () => this.list(this.pagination.page),
    });
  }

}
