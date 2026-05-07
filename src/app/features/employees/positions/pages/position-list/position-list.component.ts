import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';

import { Position } from '../../models/Position';
import { PositionService } from '../../services/position.service';
import { PositionMapper } from '../../mapper/position.mapper';
import { Pagination } from 'src/app/core/models/Pagination';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.css'],
})
export class PositionListComponent implements OnInit {

  positions: Position[] = [];
  pagination: Pagination = new Pagination();
  totalElements: number = 0;
  filterName: string = '';

  @ViewChild('positionTable') grid!: Table;

  constructor(
    private service: PositionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  list(page: number = 0): void {
    this.pagination.page = page;

    this.service.list(this.pagination, this.filterName)
      .subscribe(data => {
        this.positions = data.content.map(PositionMapper.fromDTO);
        this.totalElements = data.totalElements;
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

  delete(position: Position): void {
    if (!position.id) return;

      this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.service.delete(position.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Cargo excluído com sucesso!',
          });
        });
      },
    });
  }

}