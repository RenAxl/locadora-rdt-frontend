import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { EmployeeDTO } from 'src/app/features/employees/dtos/employee.dto';
import { EmployeeService } from 'src/app/features/employees/services/employee.service';
import { PaymentFrequencyDTO } from 'src/app/features/payment-frequencies/dtos/payment-frequency.dto';
import { PaymentFrequencyService } from 'src/app/features/payment-frequencies/services/payment-frequency.service';
import { PaymentMethodDTO } from 'src/app/features/payment-methods/dtos/payment-method.dto';
import { PaymentMethodService } from 'src/app/features/payment-methods/services/payment-method.service';
import { SupplierDTO } from 'src/app/features/suppliers/dtos/supplier.dto';
import { SupplierService } from 'src/app/features/suppliers/services/supplier.service';

import { PayableMapper } from '../../mapper/payable.mapper';
import { Payable } from '../../models/Payable';
import { PayableFileService } from '../../services/payable-file.service';
import { PayableService } from '../../services/payable.service';

@Component({
  selector: 'app-payable-form',
  templateUrl: './payable-form.component.html',
  styleUrls: ['./payable-form.component.css'],
})
export class PayableFormComponent implements OnInit {
  payable: Payable = new Payable();
  suppliers: SupplierDTO[] = [];
  employees: EmployeeDTO[] = [];
  paymentMethods: PaymentMethodDTO[] = [];
  paymentFrequencies: PaymentFrequencyDTO[] = [];
  selectedFile: File | null = null;
  selectedFileName?: string;

  constructor(
    private payableService: PayableService,
    private supplierService: SupplierService,
    private employeeService: EmployeeService,
    private paymentMethodService: PaymentMethodService,
    private paymentFrequencyService: PaymentFrequencyService,
    private payableFileService: PayableFileService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadOptions();

    const id = this.route.snapshot.paramMap.get('payableId');
    if (id != null) {
      this.payableService.findById(id).subscribe({
        next: (data) => {
          this.payable = PayableMapper.fromDetailsDTO(data);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err?.error?.message || 'Erro ao carregar conta.',
          });
        },
      });
    }
  }

  save(form: NgForm): void {
    if (form.invalid) {
      this.markFormControlsAsTouchedAndDirty(form);
      return;
    }

    if (this.payable.id) {
      this.update();
      return;
    }

    this.insert();
  }

  insert(): void {
    this.applySelectedFileName();

    this.payableService
      .insert(PayableMapper.toInsertDTO(this.payable))
      .subscribe({
        next: (created) =>
          this.uploadFileOrFinish(
            created.id,
            'Conta cadastrada com sucesso!',
            'Conta cadastrada, mas falhou ao enviar o arquivo.',
          ),
        error: (err) => this.showError(err, 'Erro ao cadastrar conta.'),
      });
  }

  update(): void {
    this.applySelectedFileName();

    this.payableService
      .update(PayableMapper.toUpdateDTO(this.payable))
      .subscribe({
        next: (updated) =>
          this.uploadFileOrFinish(
            updated.id,
            'Conta atualizada com sucesso!',
            'Conta atualizada, mas falhou ao enviar o arquivo.',
          ),
        error: (err) => this.showError(err, 'Erro ao atualizar conta.'),
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);

    this.selectedFile = file ?? null;
    this.selectedFileName = file?.name;

    if (file) {
      this.payable.fileName = file.name;
    }
  }

  compareById(a?: { id?: number }, b?: { id?: number }): boolean {
    return a?.id === b?.id;
  }

  private loadOptions(): void {
    this.supplierService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => (this.suppliers = response.content));

    this.employeeService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => (this.employees = response.content));

    this.paymentMethodService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => (this.paymentMethods = response.content));

    this.paymentFrequencyService
      .list(new Pagination(0, 1000, 'ASC', 'frequency'), '')
      .subscribe((response) => (this.paymentFrequencies = response.content));
  }

  private finishSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail,
    });

    this.router.navigate(['/payables']);
  }

  private uploadFileOrFinish(
    payableId: number | undefined,
    successMessage: string,
    uploadErrorMessage: string,
  ): void {
    if (!payableId || !this.selectedFile) {
      this.finishSuccess(successMessage);
      return;
    }

    this.payableFileService
      .upload(payableId, this.selectedFileName || this.selectedFile.name, this.selectedFile)
      .subscribe({
        next: () => this.finishSuccess(successMessage),
        error: () => this.finishSuccess(uploadErrorMessage),
      });
  }

  private applySelectedFileName(): void {
    if (this.selectedFileName) {
      this.payable.fileName = this.selectedFileName;
    }
  }

  private markFormControlsAsTouchedAndDirty(form: NgForm): void {
    form.control.markAllAsTouched();
    Object.values(form.controls).forEach((control) => control.markAsDirty());
  }

  private showError(err: any, fallback: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: err?.error?.message || fallback,
    });
  }
}
