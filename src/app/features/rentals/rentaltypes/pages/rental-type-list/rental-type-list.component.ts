import { Component, ViewChild } from '@angular/core';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  addSelectedId,
  removeSelectedId,
} from 'src/app/core/utils/selection.util';

import { RentalTypeMapper } from '../../mapper/rental-type.mapper';
import { RentalType } from '../../models/RentalType';
import { RentalTypeService } from '../../services/rental-type.service';

@Component({
  selector: 'app-rental-type-list',
  templateUrl: './rental-type-list.component.html',
  styleUrls: ['./rental-type-list.component.css'],
})
export class RentalTypeListComponent {
  rentalTypes: RentalType[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  @ViewChild('rentalTypeTable') grid!: Table;

  selectedRentalTypes: RentalType[] = [];

  selectedRentalTypeIds: number[] = [];

  detailsVisible = false;

  rentalTypeDetails: RentalType | null = null;

  constructor(
    private rentalTypeService: RentalTypeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  list(page: number = 0): void {
    this.pagination.page = page;

    this.rentalTypeService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.rentalTypes = data.content.map(RentalTypeMapper.fromDTO);
        this.totalElements = data.totalElements;
      });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event.first! / event.rows!;
    this.list(page);
  }

  searchRentalType(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(rentalType: RentalType): void {
    if (!rentalType.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.rentalTypeService.delete(rentalType.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Tipo de locação excluído com sucesso!',
          });
        });
      },
    });
  }

  deleteSelectedRentalTypes(): void {
    if (!this.selectedRentalTypeIds || this.selectedRentalTypeIds.length === 0) {
      return;
    }

    const ids = [...this.selectedRentalTypeIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} tipo(s) de locação?`,
      accept: () => {
        this.rentalTypeService.deleteAll(ids).subscribe(() => {
          this.selectedRentalTypeIds = [];
          this.selectedRentalTypes = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Tipo(s) de locação excluído(s) com sucesso!',
          });
        });
      },
    });
  }

  changeActive(rentalType: RentalType): void {
    if (!rentalType.id) {
      return;
    }

    const newStatus = !rentalType.active;

    this.rentalTypeService.changeActive(rentalType.id, newStatus).subscribe({
      next: () => {
        rentalType.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Tipo de locação ${
            newStatus ? 'ativado' : 'desativado'
          } com sucesso!`,
        });
      },
    });
  }

  openDetails(rentalType: RentalType): void {
    const id = rentalType.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.rentalTypeDetails = null;

    this.rentalTypeService.findById(id).subscribe({
      next: (details) => {
        this.rentalTypeDetails = RentalTypeMapper.fromDetailsDTO(details);
      },
    });
  }

  onRowSelect(event: any): void {
    this.selectedRentalTypeIds = addSelectedId(
      this.selectedRentalTypeIds,
      event?.data,
    );
  }

  onRowUnselect(event: any): void {
    this.selectedRentalTypeIds = removeSelectedId(
      this.selectedRentalTypeIds,
      event?.data,
    );
  }
}
