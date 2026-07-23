import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import {
  LazyLoadEvent,
  MessageService,
  ConfirmationService,
} from 'primeng/api';

import { Department } from '../../models/Department';
import { DepartmentService } from '../../services/department.service';
import { DepartmentMapper } from '../../mapper/department.mapper';
import { Pagination } from 'src/app/core/models/Pagination';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
})
export class DepartmentListComponent {
  departments: Department[] = [];
  pagination: Pagination = new Pagination();
  totalElements: number = 0;
  filterName: string = '';

  @ViewChild('departmentTable') grid!: Table;

  constructor(
    private service: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}
  list(page: number = 0): void {
    this.pagination.page = page;

    this.service.list(this.pagination, this.filterName).subscribe((data) => {
      this.departments = data.content.map(DepartmentMapper.fromDTO);
      this.totalElements = data.totalElements;
    });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event.first! / event.rows!;
    this.list(page);
  }

  searchDepartment(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(department: Department): void {
    if (!department.id) return;

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.service.delete(department.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Setor excluído com sucesso!',
          });
        });
      },
    });
  }
}
