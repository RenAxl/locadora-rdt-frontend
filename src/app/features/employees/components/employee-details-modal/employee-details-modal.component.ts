import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, EMPTY, Subscription } from 'rxjs';
import { Employee } from '../../models/Employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-details-modal',
  templateUrl: './employee-details-modal.component.html',
  styleUrls: ['./employee-details-modal.component.css'],
})
export class EmployeeDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Funcionário';
  @Input() employee: Employee | null = null;

  photoPreviewUrl?: SafeUrl;
  private objectUrl?: string;
  private sub?: Subscription;

  constructor(
    private employeeService: EmployeeService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('EMPLOYEE RECEBIDO:', this.employee);
    console.log('SALARY:', this.employee?.salary);
    console.log('TIPO DO SALARY:', typeof this.employee?.salary);
    
    const employeeChanged = !!changes['employee'];
    const visibleChanged = !!changes['visible'];

    if ((employeeChanged || visibleChanged) && this.visible) {
      this.loadEmployeePhoto();
    }

    if (visibleChanged && !this.visible) {
      this.cleanup();
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  close(): void {
    this.visibleChange.emit(false);
    this.cleanup();
  }

  getActiveLabel(active?: boolean): string {
    if (active === undefined || active === null) return '-';
    return active ? 'Sim' : 'Não';
  }

  onImgError(): void {
    this.photoPreviewUrl = undefined;
    this.cleanupObjectUrl();
  }

  private loadEmployeePhoto(): void {
    const id = this.employee?.id;
    if (!id) {
      this.photoPreviewUrl = undefined;
      this.cleanupObjectUrl();
      return;
    }

    this.sub?.unsubscribe();

    this.sub = this.employeeService
      .getEmployeePhoto(id)
      .pipe(
        catchError(() => {
          this.photoPreviewUrl = undefined;
          this.cleanupObjectUrl();
          return EMPTY;
        }),
      )
      .subscribe((blob: Blob) => {
        if (!blob || blob.size === 0) {
          this.photoPreviewUrl = undefined;
          this.cleanupObjectUrl();
          return;
        }

        this.cleanupObjectUrl();
        this.objectUrl = URL.createObjectURL(blob);
        this.photoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
          this.objectUrl,
        );
      });
  }

  private cleanup(): void {
    this.sub?.unsubscribe();
    this.sub = undefined;
    this.photoPreviewUrl = undefined;
    this.cleanupObjectUrl();
  }

  private cleanupObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }
}
