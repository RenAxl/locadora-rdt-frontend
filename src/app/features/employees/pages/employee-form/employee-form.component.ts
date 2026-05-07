import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../models/Employee';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PositionService } from '../../positions/services/position.service';
import { DepartmentService } from '../../departments/services/department.service';
import { Position } from '../../positions/models/Position';
import { Department } from '../../departments/models/Department';
import { EmployeeMapper } from '../../mapper/employee.mapper';
import { PositionMapper } from '../../positions/mapper/position.mapper';
import { DepartmentMapper } from '../../departments/mapper/department.mapper';

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

  private objectUrl?: string;
  private subs: Subscription[] = [];

  constructor(
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}

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
    this.cleanupObjectUrl();
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
        if (!this.selectedPhoto) {
          this.finishSuccess('Funcionário cadastrado com sucesso!');
          return;
        }

        const subPhoto = this.employeeService
          .updatePhoto(createdEmployee.id, this.selectedPhoto)
          .subscribe({
            next: () => {
              this.finishSuccess('Funcionário cadastrado com sucesso!');
            },
            error: (err) => {
              this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail:
                  err?.error?.message ||
                  'Funcionário cadastrado, mas falhou ao enviar a foto.',
              });

              this.router.navigate(['/employees']);
            },
          });

        this.subs.push(subPhoto);
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
        if (!this.selectedPhoto) {
          this.finishSuccess('Funcionário atualizado com sucesso!');
          return;
        }

        const subPhoto = this.employeeService
          .updatePhoto(this.employee.id!, this.selectedPhoto)
          .subscribe({
            next: () => {
              this.finishSuccess('Funcionário atualizado com sucesso!');
            },
            error: (err) => {
              this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail:
                  err?.error?.message ||
                  'Funcionário atualizado, mas falhou ao enviar a foto.',
              });

              this.router.navigate(['/employees']);
            },
          });

        this.subs.push(subPhoto);
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
    const pagination = {
      page: 0,
      linesPerPage: 1000,
      direction: 'ASC',
      orderBy: 'name',
    };

    const sub = this.positionService.list(pagination as any, '').subscribe({
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
    const pagination = {
      page: 0,
      linesPerPage: 1000,
      direction: 'ASC',
      orderBy: 'name',
    };

    const sub = this.departmentService.list(pagination as any, '').subscribe({
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

  private cleanupObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }

  private loadEmployeePhoto(employeeId: number): void {
    const sub = this.employeeService.getEmployeePhoto(employeeId).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) {
          return;
        }

        this.cleanupObjectUrl();
        this.objectUrl = URL.createObjectURL(blob);
        this.photoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
          this.objectUrl,
        );
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

    if (file) {
      this.cleanupObjectUrl();
      this.objectUrl = URL.createObjectURL(file);
      this.photoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
        this.objectUrl,
      );
    }
  }

  compareById(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }
}