import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomerDTO } from 'src/app/features/customers/dtos/customer.dto';
import { CustomerService } from 'src/app/features/customers/services/customer.service';
import { PaymentFrequencyDTO } from 'src/app/features/payment-frequencies/dtos/payment-frequency.dto';
import { PaymentFrequencyService } from 'src/app/features/payment-frequencies/services/payment-frequency.service';
import { PaymentMethodDTO } from 'src/app/features/payment-methods/dtos/payment-method.dto';
import { PaymentMethodService } from 'src/app/features/payment-methods/services/payment-method.service';

import { ReceivableMapper } from '../../mapper/receivable.mapper';
import { Receivable } from '../../models/Receivable';
import { ReceivableFileService } from '../../services/receivable-file.service';
import { ReceivableService } from '../../services/receivable.service';

@Component({
  selector: 'app-receivable-form',
  templateUrl: './receivable-form.component.html',
  styleUrls: ['./receivable-form.component.css'],
})
export class ReceivableFormComponent implements OnInit {
  receivable: Receivable = new Receivable();
  customers: CustomerDTO[] = [];
  paymentMethods: PaymentMethodDTO[] = [];
  paymentFrequencies: PaymentFrequencyDTO[] = [];
  selectedFile: File | null = null;
  selectedFileName?: string;

  constructor(
    private receivableService: ReceivableService,
    private customerService: CustomerService,
    private paymentMethodService: PaymentMethodService,
    private paymentFrequencyService: PaymentFrequencyService,
    private receivableFileService: ReceivableFileService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadOptions();

    const id = this.route.snapshot.paramMap.get('receivableId');
    if (id != null) {
      this.receivableService.findById(id).subscribe({
        next: (data) => {
          this.receivable = ReceivableMapper.fromDetailsDTO(data);
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
      form.control.markAllAsTouched();
      return;
    }

    if (!this.receivable.customerId && !this.receivable.description?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe o cliente ou a descrição da conta.',
      });
      return;
    }

    if (this.receivable.id) {
      this.update();
      return;
    }

    this.insert();
  }

  insert(): void {
    this.applySelectedFileName();

    this.receivableService
      .insert(ReceivableMapper.toInsertDTO(this.receivable))
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

    this.receivableService
      .update(ReceivableMapper.toUpdateDTO(this.receivable))
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
      this.receivable.fileName = file.name;
    }
  }

  compareById(a?: { id?: number }, b?: { id?: number }): boolean {
    return a?.id === b?.id;
  }

  private loadOptions(): void {
    this.customerService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => (this.customers = response.content));

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

    this.router.navigate(['/receivables']);
  }

  private uploadFileOrFinish(
    receivableId: number | undefined,
    successMessage: string,
    uploadErrorMessage: string,
  ): void {
    if (!receivableId || !this.selectedFile) {
      this.finishSuccess(successMessage);
      return;
    }

    this.receivableFileService
      .upload(receivableId, this.selectedFileName || this.selectedFile.name, this.selectedFile)
      .subscribe({
        next: () => this.finishSuccess(successMessage),
        error: () => this.finishSuccess(uploadErrorMessage),
      });
  }

  private applySelectedFileName(): void {
    if (this.selectedFileName) {
      this.receivable.fileName = this.selectedFileName;
    }
  }

  private showError(err: any, fallback: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: err?.error?.message || fallback,
    });
  }
}
