import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';

import { ReceivableMapper } from '../../mapper/receivable.mapper';
import { Receivable } from '../../models/Receivable';
import { ReceivableService } from '../../services/receivable.service';

@Component({
  selector: 'app-receivable-list',
  templateUrl: './receivable-list.component.html',
  styleUrls: ['./receivable-list.component.css'],
})
export class ReceivableListComponent implements OnInit {
  receivables: Receivable[] = [];

  pagination: Pagination = new Pagination(0, 5, 'ASC', 'description');

  totalElements: number = 0;

  filterDescription: string = '';

  loading: boolean = false;

  constructor(private receivableService: ReceivableService) {}

  ngOnInit(): void {
    this.list();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.receivableService
      .list(this.pagination, this.filterDescription)
      .subscribe({
        next: (data) => {
          this.receivables = data.content.map(ReceivableMapper.fromDTO);
          this.totalElements = data.totalElements;
          this.loading = false;
        },
        error: () => {
          this.receivables = [];
          this.totalElements = 0;
          this.loading = false;
        },
      });
  }

  changePage(event: LazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? this.pagination.linesPerPage;

    this.pagination.linesPerPage = rows;
    this.list(first / rows);
  }

  searchReceivable(description: string): void {
    this.filterDescription = description;
    this.list();
  }

  getStatusLabel(receivable: Receivable): string {
    return receivable.paid ? 'Pago' : 'Pendente';
  }

  getStatusClass(receivable: Receivable): string {
    return receivable.paid ? 'status-paid' : 'status-open';
  }
}
