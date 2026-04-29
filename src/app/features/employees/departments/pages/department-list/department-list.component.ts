import { Component, OnInit, ViewChild } from '@angular/core';
import { Department } from '../../models/Department';
import { Pagination } from 'src/app/core/models/Pagination';
import { Table } from 'primeng/table';
import { DepartmentService } from '../../services/department.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  @ViewChild('departmentTable') grid!: Table;

  constructor(
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {}

list(page: number = 0): void {
    this.pagination.page = page;

    this.departmentService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.departments = data.content;
        this.totalElements = data.totalElements;
      });
  }

  changePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.list(page);
  }

  searchDepartment(name: string) {
    this.filterName = name;
    this.list();
  }

    delete(department: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.departmentService.delete(department.id).subscribe(() => {
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
