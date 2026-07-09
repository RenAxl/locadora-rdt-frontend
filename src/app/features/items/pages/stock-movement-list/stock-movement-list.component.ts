import { Component, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Pagination } from 'src/app/core/models/Pagination';

import { StockMovementMapper } from '../../mapper/stock-movement.mapper';
import { StockMovement } from '../../models/stock/StockMovement';
import { StockMovementService } from '../../services/stock/stock-movement.service';

@Component({
  selector: 'app-stock-movement-list',
  templateUrl: './stock-movement-list.component.html',
  styleUrls: ['./stock-movement-list.component.css'],
})
export class StockMovementListComponent {
  movements: StockMovement[] = [];
  pagination: Pagination = new Pagination(0, 5, 'DESC', 'createdAt');
  totalElements: number = 0;
  filterName: string = '';

  @ViewChild('movementTable') grid!: Table;

  constructor(private stockMovementService: StockMovementService) {}

  list(page: number = 0): void {
    this.pagination.page = page;

    this.stockMovementService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.movements = data.content.map(StockMovementMapper.fromDTO);
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

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      ENTRY: 'Entrada',
      EXIT: 'Saída',
      RESERVE: 'Reserva',
      RETURN: 'Devolução',
      ADJUSTMENT: 'Ajuste',
    };

    return labels[type] || type;
  }
}
