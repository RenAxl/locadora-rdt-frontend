import { Component, ViewChild } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Pagination } from 'src/app/core/models/Pagination';

import { StockBalanceMapper } from '../../mapper/stock-balance.mapper';
import { StockBalance } from '../../models/stock/StockBalance';
import { StockBalanceService } from '../../services/stock/stock-balance.service';

type StockBalanceEditField =
  | 'total'
  | 'available'
  | 'reserved'
  | 'minimum';

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
  editingBalance: StockBalance | null = null;
  editField: StockBalanceEditField = 'total';
  editQuantity: number = 0;

  editFieldOptions = [
    { value: 'total', label: 'Total' },
    { value: 'available', label: 'Disponível' },
    { value: 'reserved', label: 'Alugado' },
    { value: 'minimum', label: 'Estoque mínimo' },
  ];

  @ViewChild('stockTable') grid!: Table;

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

  edit(balance: StockBalance): void {
    this.editingBalance = new StockBalance(balance);
    this.editField = 'total';
    this.editQuantity = this.editingBalance.totalQuantity ?? 0;
  }

  cancelEdit(): void {
    this.editingBalance = null;
    this.editField = 'total';
    this.editQuantity = 0;
  }

  changeEditField(): void {
    if (!this.editingBalance) {
      return;
    }

    if (this.editField === 'total') {
      this.editQuantity = this.editingBalance.totalQuantity ?? 0;
    } else if (this.editField === 'available') {
      this.editQuantity = this.editingBalance.availableQuantity ?? 0;
    } else if (this.editField === 'reserved') {
      this.editQuantity = this.editingBalance.reservedQuantity ?? 0;
    } else {
      this.editQuantity = this.editingBalance.minimumQuantity ?? 0;
    }
  }

  updateEditedQuantity(): void {
    if (!this.editingBalance) {
      return;
    }

    const quantity = this.toPositiveNumber(this.editQuantity);

    if (this.editField === 'total') {
      this.editingBalance.totalQuantity = quantity;
    } else if (this.editField === 'available') {
      this.editingBalance.availableQuantity = quantity;
    } else if (this.editField === 'reserved') {
      this.editingBalance.reservedQuantity = quantity;
    } else {
      this.editingBalance.minimumQuantity = quantity;
    }

    this.updateQuantities();
  }

  private updateQuantities(): void {
    if (!this.editingBalance) {
      return;
    }

    const total = this.toPositiveNumber(this.editingBalance.totalQuantity);
    const available = this.toPositiveNumber(this.editingBalance.availableQuantity);
    const reserved = this.toPositiveNumber(this.editingBalance.reservedQuantity);
    const unavailable = this.toPositiveNumber(this.editingBalance.unavailableQuantity);

    if (this.editField === 'minimum') {
      return;
    }

    if (this.editField === 'available') {
      this.editingBalance.totalQuantity = available + reserved + unavailable;
      return;
    }

    const used = reserved + unavailable;
    const correctedTotal = total < used ? used : total;
    this.editingBalance.totalQuantity = correctedTotal;
    this.editingBalance.availableQuantity = correctedTotal - used;

    if (this.editField === 'total') {
      this.editQuantity = correctedTotal;
    }
  }

  saveBalance(): void {
    if (!this.editingBalance?.id) {
      return;
    }

    const dto = StockBalanceMapper.toUpdateDTO(this.editingBalance);

    this.stockBalanceService.update(dto).subscribe({
      next: () => {
        this.editingBalance = null;
        this.grid.reset();
        this.messageService.add({
          severity: 'success',
          detail: 'Saldo atualizado com sucesso!',
        });
      },
    });
  }

  private toPositiveNumber(value: number | undefined): number {
    const numberValue = Number(value ?? 0);

    if (Number.isNaN(numberValue) || numberValue < 0) {
      return 0;
    }

    return numberValue;
  }
}
