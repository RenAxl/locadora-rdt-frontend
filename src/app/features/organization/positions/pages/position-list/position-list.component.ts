import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';

import { Position } from '../../models/Position';
import { PositionService } from '../../services/position.service';
import { PositionMapper } from '../../mapper/position.mapper';
import { Pagination } from 'src/app/core/models/Pagination';

const DELETE_CONFIRMATION_MESSAGE = 'Tem certeza que deseja excluir?';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.css'],
})
export class PositionListComponent {
  positions: Position[] = [];
  pagination: Pagination = new Pagination();
  totalElements: number = 0;
  filterName: string = '';

  @ViewChild('positionTable') grid!: Table;

  constructor(
    private positionService: PositionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  list(page: number = 0): void {
    this.pagination.page = page;

    this.positionService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.positions = data.content.map(PositionMapper.fromDTO);
        this.totalElements = data.totalElements;
      },
      error: (err) => this.showError(err, 'Erro ao listar cargos.'),
    });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event.first! / event.rows!;
    this.list(page);
  }

  searchPosition(name: string): void {
    this.filterName = name;
    this.list();
  }

  confirmDelete(position: Position): void {
    if (!position.id) return;

    this.confirmationService.confirm({
      message: DELETE_CONFIRMATION_MESSAGE,
      accept: () => {
        this.delete(position.id!);
      },
    });
  }

  private delete(id: number): void {
    this.positionService.delete(id).subscribe({
      next: () => {
        this.grid.reset();
        this.messageService.add({
          severity: 'success',
          detail: 'Cargo excluído com sucesso!',
        });
      },
      error: (err) => this.showError(err, 'Erro ao excluir cargo.'),
    });
  }

  private showError(err: { error?: { message?: string } }, fallback: string): void {
    this.messageService.add({
      severity: 'error',
      detail: err?.error?.message || fallback,
    });
  }
}

