import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';

import { ReceivablePaymentDTO } from '../../dtos/receivable.dto';
import { ReceivableMapper } from '../../mapper/receivable.mapper';
import { Receivable } from '../../models/Receivable';
import { ReceivableFilters, ReceivableService } from '../../services/receivable.service';

interface ReceivableCharges {
  lateFee: number;
  lateInterest: number;
}

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

  paymentChoiceVisible = false;
  paymentEditChargesVisible = false;
  paymentModalVisible = false;
  paymentReceivable: Receivable | null = null;
  paymentCharges: ReceivableCharges = { lateFee: 0, lateInterest: 0 };

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

    this.paymentReceivable = receivable;
    this.paymentCharges = this.getDefaultCharges(receivable);

    if (this.isOverdueOpenReceivable(receivable)) {
      this.paymentChoiceVisible = true;
      return;
    }

    this.paymentModalVisible = true;
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

  useDefaultPaymentCharges(): void {
    if (!this.paymentReceivable) {
      return;
    }

    this.paymentCharges = this.getDefaultCharges(this.paymentReceivable);
    this.paymentChoiceVisible = false;
    this.paymentModalVisible = true;
  }

  editPaymentCharges(): void {
    this.paymentChoiceVisible = false;
    this.paymentEditChargesVisible = true;
  }

  finishPaymentChargesEdit(charges: ReceivableCharges): void {
    this.paymentCharges = charges;
    this.paymentEditChargesVisible = false;
    this.paymentModalVisible = true;
  }

  submitPayment(dto: ReceivablePaymentDTO): void {
    if (!this.paymentReceivable?.id) {
      return;
    }

    this.receivableService.pay(this.paymentReceivable.id, dto).subscribe({
      next: () => {
        this.paymentModalVisible = false;
        this.paymentReceivable = null;
        this.list(this.pagination.page);
        this.messageService.add({ severity: 'success', detail: 'Baixa registrada!' });
      },
      error: (err) => this.showError(err, 'Erro ao registrar baixa.'),
    });
  }

  private getDefaultCharges(receivable: Receivable): ReceivableCharges {
    return {
      lateFee: Number(receivable.calculatedLateFee ?? 0),
      lateInterest: Number(receivable.calculatedLateInterest ?? 0),
    };
  }

  private isOverdueOpenReceivable(receivable: Receivable): boolean {
    if (receivable.paid || receivable.canceled || !receivable.dueDate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(receivable.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate.getTime() < today.getTime() && this.getReceivableOpenAmount(receivable) > 0;
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

    this.openPdfPreview(
      this.receivableService.receipt(receivable.id),
      'Erro ao gerar recibo.',
    );
  }

  generateFiscalCoupon(receivable: Receivable): void {
    if (!receivable.id) {
      return;
    }

    this.openPdfPreview(
      this.receivableService.fiscalCoupon(receivable.id),
      'Erro ao gerar cupom fiscal.',
    );
  }

  private openPdfPreview(request: Observable<Blob>, fallback: string): void {
    request.subscribe({
      next: (pdf) => {
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: (err) => this.showError(err, fallback),
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
