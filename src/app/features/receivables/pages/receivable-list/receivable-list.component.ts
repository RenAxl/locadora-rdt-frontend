import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';

import { ReceivablePaymentDTO } from '../../dtos/receivable.dto';
import { ReceivableMapper } from '../../mapper/receivable.mapper';
import { Receivable } from '../../models/Receivable';
import { ReceivableFilters, ReceivableService } from '../../services/receivable.service';

@Component({
  selector: 'app-receivable-list',
  templateUrl: './receivable-list.component.html',
  styleUrls: ['./receivable-list.component.css'],
})
export class ReceivableListComponent implements OnInit {
  receivables: Receivable[] = [];
  pagination: Pagination = new Pagination(0, 10, 'ASC', 'dueDate');
  totalElements = 0;

  filters: ReceivableFilters = {
    search: '',
    status: 'ALL',
    periodType: 'DUE_DATE',
    startDate: null,
    endDate: null,
    orderBy: 'dueDate',
    direction: 'ASC',
  };

  detailsVisible = false;
  receivableDetails: Receivable | null = null;

  overdueVisible = false;
  overdueReceivable: Receivable | null = null;

  filesVisible = false;
  selectedReceivableId?: number;
  selectedReceivableDescription?: string;

  constructor(
    private receivableService: ReceivableService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.list();
  }

  list(page: number = 0): void {
    this.pagination.page = page;

    this.receivableService.list(this.pagination, this.filters).subscribe({
      next: (data) => {
        this.receivables = data.content.map(ReceivableMapper.fromDTO);
        this.totalElements = data.totalElements;
      },
      error: (err) => this.showError(err, 'Erro ao listar contas.'),
    });
  }

  changePage(event: LazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? this.pagination.linesPerPage;
    const page = first / rows;

    this.pagination.linesPerPage = event.rows ?? this.pagination.linesPerPage;
    this.list(page);
  }

  applyFilters(filters: ReceivableFilters): void {
    this.filters = filters;
    this.pagination.orderBy = filters.orderBy || this.pagination.orderBy;
    this.pagination.direction = filters.direction || this.pagination.direction;
    this.list(0);
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      status: 'ALL',
      periodType: 'DUE_DATE',
      startDate: null,
      endDate: null,
      orderBy: 'dueDate',
      direction: 'ASC',
    };
    this.pagination.orderBy = 'dueDate';
    this.pagination.direction = 'ASC';
    this.list(0);
  }

  delete(receivable: Receivable): void {
    if (!receivable.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.receivableService.delete(receivable.id!).subscribe(() => {
          this.list(this.pagination.page);
          this.messageService.add({
            severity: 'success',
            detail: 'Conta excluída com sucesso!',
          });
        });
      },
    });
  }

  pay(receivable: Receivable): void {
    const amount = this.getReceivableOpenAmount(receivable);
    if (!receivable.id) {
      return;
    }

    if (amount <= 0) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Esta conta não possui saldo para baixa.',
      });
      return;
    }

    const paymentAmount = this.askPaymentAmount(amount);
    if (paymentAmount == null) {
      return;
    }

    const dto: ReceivablePaymentDTO = {
      paymentAmount,
      paymentDate: this.todayDateString(),
      paymentMethodId: receivable.paymentMethodId ?? null,
      subtotal: paymentAmount,
      fee: 0,
      lateInterest: 0,
      lateFee: 0,
      discount: 0,
    };

    const paymentType = paymentAmount === amount ? 'total' : 'parcial';
    this.confirmationService.confirm({
      message: `Confirmar baixa ${paymentType} de ${this.formatCurrency(paymentAmount)}?`,
      accept: () => {
        this.receivableService.pay(receivable.id!, dto).subscribe({
          next: () => {
            this.list(this.pagination.page);
            this.messageService.add({ severity: 'success', detail: 'Baixa registrada!' });
          },
          error: (err) => this.showError(err, 'Erro ao registrar baixa.'),
        });
      },
    });
  }

  getReceivableOpenAmount(receivable: Receivable): number {
    if (receivable.paid) {
      return 0;
    }

    const amount = Number(receivable.amount ?? 0);
    const paidAmount = this.hasPaymentRecord(receivable) ? Number(receivable.subtotal ?? 0) : 0;
    if (amount > 0 && paidAmount >= amount) {
      return 0;
    }

    if (amount > 0 && paidAmount > 0 && paidAmount < amount) {
      return Math.round((amount - paidAmount) * 100) / 100;
    }

    const remaining = receivable.remainingBalance;

    if (remaining != null && remaining > 0 && remaining < amount) {
      return Number(remaining);
    }

    return amount;
  }

  private hasPaymentRecord(receivable: Receivable): boolean {
    return Boolean(receivable.paid || receivable.paymentDate);
  }

  private askPaymentAmount(openAmount: number): number | null {
    const typedValue = window.prompt('Valor da baixa', this.formatDecimal(openAmount));
    if (typedValue == null) {
      return null;
    }

    const paymentAmount = this.parseDecimal(typedValue);
    if (paymentAmount == null || paymentAmount <= 0) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Informe um valor de baixa maior que zero.',
      });
      return null;
    }

    if (paymentAmount > openAmount) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Valor de baixa não pode ser maior que o saldo da conta.',
      });
      return null;
    }

    return paymentAmount;
  }

  private parseDecimal(value: string): number | null {
    const normalized = value.trim().replace(/\./g, '').replace(',', '.');
    if (!normalized) {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : null;
  }

  private formatDecimal(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  private todayDateString(): string {
    const today = new Date();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');

    return `${today.getFullYear()}-${month}-${day}`;
  }

  installment(receivable: Receivable): void {
    if (!receivable.id) {
      return;
    }

    const installments = Number(window.prompt('Quantidade de parcelas', '2'));
    if (!installments || installments < 2) {
      return;
    }

    this.receivableService
      .installment(receivable.id, { installments })
      .subscribe({
        next: () => {
          this.list(this.pagination.page);
          this.messageService.add({ severity: 'success', detail: 'Conta parcelada!' });
        },
        error: (err) => this.showError(err, 'Erro ao parcelar conta.'),
      });
  }

  generateReceipt(receivable: Receivable): void {
    if (!receivable.id) {
      return;
    }

    this.receivableService.receipt(receivable.id).subscribe({
      next: (text) => {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `recibo-${receivable.id}.txt`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: (err) => this.showError(err, 'Erro ao gerar recibo.'),
    });
  }

  openDetails(receivable: Receivable): void {
    if (!receivable.id) {
      return;
    }

    this.detailsVisible = true;
    this.receivableDetails = null;

    this.receivableService.findById(receivable.id).subscribe({
      next: (details) => {
        this.receivableDetails = ReceivableMapper.fromDetailsDTO(details);
      },
    });
  }

  openOverdueDetails(receivable: Receivable): void {
    this.overdueReceivable = receivable;
    this.overdueVisible = true;
  }

  openFilesModal(receivable: Receivable): void {
    this.selectedReceivableId = receivable.id;
    this.selectedReceivableDescription = receivable.description;
    this.filesVisible = true;
  }

  private showError(err: any, fallback: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: err?.error?.message || fallback,
    });
  }
}
