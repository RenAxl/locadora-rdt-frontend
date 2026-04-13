import { Component, OnInit, ViewChild } from '@angular/core';
import { Position } from '../../models/Position';
import { Pagination } from 'src/app/core/models/Pagination';
import { Table } from 'primeng/table';
import { PositionService } from '../../services/position.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';

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
    private positionService: PositionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {}

list(page: number = 0): void {
    this.pagination.page = page;

    this.positionService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.positions = data.content;
        this.totalElements = data.totalElements;
      });
  }

  changePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.list(page);
  }

  searchPosition(name: string) {
    this.filterName = name;
    this.list();
  }

    delete(position: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.positionService.delete(position.id).subscribe(() => {
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
