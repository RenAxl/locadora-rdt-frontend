import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../models/Employee';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PositionService } from '../../../positions/services/position.service';
import { DepartmentService } from '../../../departments/services/department.service';
import { Position } from '../../../positions/models/Position';
import { Department } from '../../../departments/models/Department';
import { EmployeeMapper } from '../../mapper/employee.mapper';
import { PositionMapper } from '../../../positions/mapper/position.mapper';
import { DepartmentMapper } from '../../../departments/mapper/department.mapper';
import { PhotoPreview } from 'src/app/core/utils/photo-preview.util';
import { Pagination } from 'src/app/core/models/Pagination';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  employee: Employee = new Employee({
    active: true,
  });

  positions: Position[] = [];
  departments: Department[] = [];

  selectedPhoto: File | null = null;
  selectedPhotoName?: string;
  photoPreviewUrl: SafeUrl | null = null;

  private subs: Subscription[] = [];
  private photoPreview: PhotoPreview;

  constructor(
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {
    this.photoPreview = new PhotoPreview(sanitizer);
  }

  ngOnInit(): void {
    this.loadPositions();
    this.loadDepartments();

    const id = this.route.snapshot.paramMap.get('employeeId');

    if (id != null) {
      const sub = this.employeeService.findById(id).subscribe({
        next: (data) => {
          this.employee = EmployeeMapper.fromDetailsDTO(data);
          this.loadEmployeePhoto(Number(id));
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err?.error?.message || 'Erro ao carregar funcionário.',
          });
        },
      });

      this.subs.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.photoPreview.clear();
    this.subs.forEach((s) => s.unsubscribe());
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.isInvalidDateRange()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail:
          'A data de desligamento não pode ser menor que a data de admissão.',
      });
      return;
    }

    if (this.employee.id != null) {
      this.update();
    } else {
      this.insert();
    }
  }

  public isInvalidDateRange(): boolean {
    if (!this.employee.hireDate || !this.employee.terminationDate) {
      return false;
    }

    const hire = new Date(this.employee.hireDate);
    const termination = new Date(this.employee.terminationDate);

    return termination < hire;
  }

  insert(): void {
    const dto = EmployeeMapper.toInsertDTO(this.employee);

    const sub = this.employeeService.insert(dto).subscribe({
      next: (createdEmployee) => {
        this.uploadPhotoOrFinish(
          createdEmployee.id,
          'Funcionário cadastrado com sucesso!',
          'Funcionário cadastrado, mas falhou ao enviar a foto.',
        );
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao cadastrar funcionário.',
        });
      },
    });

    this.subs.push(sub);
  }

  update(): void {
    if (!this.employee.id) {
      return;
    }

    const dto = EmployeeMapper.toUpdateDTO(this.employee);

    const sub = this.employeeService.update(dto).subscribe({
      next: () => {
        this.uploadPhotoOrFinish(
          this.employee.id,
          'Funcionário atualizado com sucesso!',
          'Funcionário atualizado, mas falhou ao enviar a foto.',
        );
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Erro ao atualizar funcionário.',
        });
      },
    });

    this.subs.push(sub);
  }

  private finishSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail,
    });

    this.employee = new Employee({ active: true });
    this.employee.position = undefined;
    this.employee.department = undefined;
    this.selectedPhoto = null;
    this.selectedPhotoName = undefined;
    this.photoPreviewUrl = null;

    this.router.navigate(['/employees']);
  }

  private loadPositions(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    const sub = this.positionService.list(pagination, '').subscribe({
      next: (response) => {
        this.positions = (response?.content ?? []).map(PositionMapper.fromDTO);
      },
      error: () => {
        this.positions = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Não foi possível carregar os cargos.',
        });
      },
    });

    this.subs.push(sub);
  }

  private loadDepartments(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    const sub = this.departmentService.list(pagination, '').subscribe({
      next: (response) => {
        this.departments = (response?.content ?? []).map(
          DepartmentMapper.fromDTO,
        );
      },
      error: () => {
        this.departments = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Não foi possível carregar os setores.',
        });
      },
    });

    this.subs.push(sub);
  }

  private loadEmployeePhoto(employeeId: number): void {
    const sub = this.employeeService.getEmployeePhoto(employeeId).subscribe({
      next: (blob) => {
        this.photoPreviewUrl = this.photoPreview.create(blob);
      },
      error: () => {
        this.photoPreviewUrl = null;
      },
    });

    this.subs.push(sub);
  }

  onPhotoSelected(event: any): void {
    const file = event?.target?.files?.[0] ?? null;

    this.selectedPhoto = file;
    this.selectedPhotoName = file?.name ?? undefined;

    this.photoPreviewUrl = file ? this.photoPreview.create(file) : null;
  }

  compareById(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }

  private uploadPhotoOrFinish(
    employeeId: number | undefined,
    successMessage: string,
    uploadErrorMessage: string,
  ): void {
    if (!employeeId || !this.selectedPhoto) {
      this.finishSuccess(successMessage);
      return;
    }

    const sub = this.employeeService
      .updatePhoto(employeeId, this.selectedPhoto)
      .subscribe({
        next: () => this.finishSuccess(successMessage),
        error: (err) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Atenção',
            detail: err?.error?.message || uploadErrorMessage,
          });

          this.router.navigate(['/employees']);
        },
      });

    this.subs.push(sub);
  }
}
