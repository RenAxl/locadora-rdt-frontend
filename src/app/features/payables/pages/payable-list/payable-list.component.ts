import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';

import { PayablePaymentDTO } from '../../dtos/payable.dto';
import { PayableMapper } from '../../mapper/payable.mapper';
import { Payable } from '../../models/Payable';
import { PayableFilters, PayableService } from '../../services/payable.service';

interface PayableCharges {
  lateFee: number;
  lateInterest: number;
}

@Component({
  selector: 'app-payable-list',
  templateUrl: './payable-list.component.html',
  styleUrls: ['./payable-list.component.css'],
})
export class PayableListComponent implements OnInit {
  payables: Payable[] = [];
  pagination: Pagination = new Pagination(0, 10, 'ASC', 'dueDate');
  totalElements = 0;

  filters: PayableFilters = {
    search: '',
    status: 'ALL',
    periodType: 'DUE_DATE',
    startDate: null,
    endDate: null,
    orderBy: 'dueDate',
    direction: 'ASC',
  };

  detailsVisible = false;
  payableDetails: Payable | null = null;

  overdueVisible = false;
  overduePayable: Payable | null = null;

  paymentChoiceVisible = false;
  paymentEditChargesVisible = false;
  paymentModalVisible = false;
  paymentPayable: Payable | null = null;
  paymentCharges: PayableCharges = { lateFee: 0, lateInterest: 0 };

  filesVisible = false;
  selectedPayableId?: number;
  selectedPayableDescription?: string;

  constructor(
    private payableService: PayableService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.list();
  }

  list(page: number = 0): void {
    this.pagination.page = page;

    this.payableService.list(this.pagination, this.filters).subscribe({
      next: (data) => {
        this.payables = data.content.map(PayableMapper.fromDTO);
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

  applyFilters(filters: PayableFilters): void {
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

  delete(payable: Payable): void {
    if (!payable.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.payableService.delete(payable.id!).subscribe(() => {
          this.list(this.pagination.page);
          this.messageService.add({
            severity: 'success',
            detail: 'Conta excluída com sucesso!',
          });
        });
      },
    });
  }

  pay(payable: Payable): void {
    const amount = this.getPayableOpenAmount(payable);
    if (!payable.id) {
      return;
    }

    if (amount <= 0) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Esta conta não possui saldo para baixa.',
      });
      return;
    }

    this.paymentPayable = payable;
    this.paymentCharges = this.getDefaultCharges(payable);

    if (this.isOverdueOpenPayable(payable)) {
      this.paymentChoiceVisible = true;
      return;
    }

    this.paymentModalVisible = true;
  }

  getPayableOpenAmount(payable: Payable): number {
    if (payable.paid) {
      return 0;
    }

    const amount = Number(payable.amount ?? 0);
    const paidAmount = this.hasPaymentRecord(payable) ? Number(payable.subtotal ?? 0) : 0;
    if (amount > 0 && paidAmount >= amount) {
      return 0;
    }

    if (amount > 0 && paidAmount > 0 && paidAmount < amount) {
      return Math.round((amount - paidAmount) * 100) / 100;
    }

    const remaining = payable.remainingBalance;

    if (remaining != null && remaining > 0 && remaining < amount) {
      return Number(remaining);
    }

    return amount;
  }

  private hasPaymentRecord(payable: Payable): boolean {
    return Boolean(payable.paid || payable.paymentDate);
  }

  useDefaultPaymentCharges(): void {
    if (!this.paymentPayable) {
      return;
    }

    this.paymentCharges = this.getDefaultCharges(this.paymentPayable);
    this.paymentChoiceVisible = false;
    this.paymentModalVisible = true;
  }

  editPaymentCharges(): void {
    this.paymentChoiceVisible = false;
    this.paymentEditChargesVisible = true;
  }

  finishPaymentChargesEdit(charges: PayableCharges): void {
    this.paymentCharges = charges;
    this.paymentEditChargesVisible = false;
    this.paymentModalVisible = true;
  }

  submitPayment(dto: PayablePaymentDTO): void {
    if (!this.paymentPayable?.id) {
      return;
    }

    this.payableService.pay(this.paymentPayable.id, dto).subscribe({
      next: () => {
        this.paymentModalVisible = false;
        this.paymentPayable = null;
        this.list(this.pagination.page);
        this.messageService.add({ severity: 'success', detail: 'Baixa registrada!' });
      },
      error: (err) => this.showError(err, 'Erro ao registrar baixa.'),
    });
  }

  private getDefaultCharges(payable: Payable): PayableCharges {
    return {
      lateFee: Number(payable.calculatedLateFee ?? 0),
      lateInterest: Number(payable.calculatedLateInterest ?? 0),
    };
  }

  private isOverdueOpenPayable(payable: Payable): boolean {
    if (payable.paid || payable.canceled || !payable.dueDate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(payable.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate.getTime() < today.getTime() && this.getPayableOpenAmount(payable) > 0;
  }

  installment(payable: Payable): void {
    if (!payable.id) {
      return;
    }

    const installments = Number(window.prompt('Quantidade de parcelas', '2'));
    if (!installments || installments < 2) {
      return;
    }

    this.payableService
      .installment(payable.id, { installments })
      .subscribe({
        next: () => {
          this.list(this.pagination.page);
          this.messageService.add({ severity: 'success', detail: 'Conta parcelada!' });
        },
        error: (err) => this.showError(err, 'Erro ao parcelar conta.'),
      });
  }

  openDetails(payable: Payable): void {
    if (!payable.id) {
      return;
    }

    this.detailsVisible = true;
    this.payableDetails = null;

    this.payableService.findById(payable.id).subscribe({
      next: (details) => {
        this.payableDetails = PayableMapper.fromDetailsDTO(details);
      },
    });
  }

  openOverdueDetails(payable: Payable): void {
    this.overduePayable = payable;
    this.overdueVisible = true;
  }

  openFilesModal(payable: Payable): void {
    this.selectedPayableId = payable.id;
    this.selectedPayableDescription = payable.description;
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
