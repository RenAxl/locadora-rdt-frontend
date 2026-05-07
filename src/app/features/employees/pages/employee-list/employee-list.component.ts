import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from '../../models/Employee';
import { Pagination } from 'src/app/core/models/Pagination';
import { EmployeeService } from '../../services/employee.service';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { EmployeeMapper } from '../../mapper/employee.mapper';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  @ViewChild('employeeTable') grid!: Table;

  photoMap: { [key: number]: SafeUrl } = {};

  selectedEmployees: Employee[] = [];

  selectedEmployeeIds: number[] = [];

  detailsVisible = false;

  employeeDetails: Employee | null = null;

  filesVisible: boolean = false;

  selectedEmployeeId?: number;
  selectedEmployeeName?: string;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {}

  list(page: number = 0): void {
    this.pagination.page = page;

    this.employeeService
      .list(this.pagination, this.filterName)
      .subscribe((data) => {
        this.employees = data.content.map(EmployeeMapper.fromDTO);
        this.totalElements = data.totalElements;

        this.loadPhotos();
      });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event.first! / event.rows!;
    this.list(page);
  }

  searchEmployee(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(employee: Employee): void {
    if (!employee.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.employeeService.delete(employee.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Funcionário excluído com sucesso!',
          });
        });
      },
    });
  }

  private loadPhotos(): void {
    this.photoMap = {};

    this.employees.forEach((employee) => {
      if (!employee.id) {
        return;
      }

      this.employeeService
        .getEmployeePhoto(employee.id)
        .pipe(
          catchError(() => {
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          if (!blob || blob.size === 0) {
            return;
          }

          const objectUrl = URL.createObjectURL(blob);
          this.photoMap[employee.id!] =
            this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        });
    });
  }

  onRowSelect(event: any): void {
    const id = event?.data?.id;

    if (id == null) {
      return;
    }

    if (!this.selectedEmployeeIds.includes(id)) {
      this.selectedEmployeeIds.push(id);
    }
  }

  onRowUnselect(event: any): void {
    const id = event?.data?.id;

    if (id == null) {
      return;
    }

    this.selectedEmployeeIds = this.selectedEmployeeIds.filter((x) => x !== id);
  }

  deleteSelectedEmployees(): void {
    if (!this.selectedEmployeeIds || this.selectedEmployeeIds.length === 0) {
      return;
    }

    const ids = [...this.selectedEmployeeIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} funcionário(s)?`,
      accept: () => {
        this.employeeService.deleteAll(ids).subscribe(() => {
          this.selectedEmployeeIds = [];
          this.selectedEmployees = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Funcionário(s) excluído(s) com sucesso!',
          });
        });
      },
    });
  }

  changeActive(employee: Employee): void {
    if (!employee.id) {
      return;
    }

    const newStatus = !employee.active;

    this.employeeService.changeActive(employee.id, newStatus).subscribe({
      next: () => {
        employee.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Funcionário ${
            newStatus ? 'ativado' : 'desativado'
          } com sucesso!`,
        });
      },
    });
  }

  openDetails(employee: Employee): void {
    const id = employee.id;

    if (id == null) return;
    
    this.detailsVisible = true;
    this.employeeDetails = null;

    this.employeeService.findById(id).subscribe({
      next: (details) => {
        this.employeeDetails = EmployeeMapper.fromDetailsDTO(details);
      },
    });
  }

  openFilesModal(employee: Employee): void {
    this.selectedEmployeeId = employee.id;
    this.selectedEmployeeName = employee.name;
    this.filesVisible = true;
  }

  hasAuthority(role: string): boolean {
    return this.authService.hasAuthority(role);
  }
}
