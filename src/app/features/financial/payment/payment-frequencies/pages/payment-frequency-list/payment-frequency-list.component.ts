import { Component, ViewChild } from '@angular/core';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  addSelectedId,
  removeSelectedId,
} from 'src/app/core/utils/selection.util';

import { PaymentFrequencyMapper } from '../../mapper/payment-frequency.mapper';
import { PaymentFrequency } from '../../models/PaymentFrequency';
import { PaymentFrequencyService } from '../../services/payment-frequency.service';

@Component({
  selector: 'app-payment-frequency-list',
  templateUrl: './payment-frequency-list.component.html',
  styleUrls: ['./payment-frequency-list.component.css'],
})
export class PaymentFrequencyListComponent {
  paymentFrequencies: PaymentFrequency[] = [];
  pagination: Pagination = new Pagination(0, 5, 'ASC', 'frequency');
  totalElements: number = 0;
  filterFrequency: string = '';

  selectedPaymentFrequencies: PaymentFrequency[] = [];
  selectedPaymentFrequencyIds: number[] = [];

  detailsVisible = false;
  paymentFrequencyDetails: PaymentFrequency | null = null;

  @ViewChild('paymentFrequencyTable') grid!: Table;

  constructor(
    private service: PaymentFrequencyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}
  list(page: number = 0): void {
    this.pagination.page = page;

    this.service
      .list(this.pagination, this.filterFrequency)
      .subscribe((data) => {
        this.paymentFrequencies = data.content.map(
          PaymentFrequencyMapper.fromDTO,
        );
        this.totalElements = data.totalElements;
      });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event.first! / event.rows!;
    this.list(page);
  }

  searchPaymentFrequency(frequency: string): void {
    this.filterFrequency = frequency;
    this.list();
  }

  delete(paymentFrequency: PaymentFrequency): void {
    if (!paymentFrequency.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.service.delete(paymentFrequency.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Frequência de pagamento excluída com sucesso!',
          });
        });
      },
    });
  }

  onRowSelect(event: any): void {
    this.selectedPaymentFrequencyIds = addSelectedId(
      this.selectedPaymentFrequencyIds,
      event?.data,
    );
  }

  onRowUnselect(event: any): void {
    this.selectedPaymentFrequencyIds = removeSelectedId(
      this.selectedPaymentFrequencyIds,
      event?.data,
    );
  }

  deleteSelectedPaymentFrequencies(): void {
    if (
      !this.selectedPaymentFrequencyIds ||
      this.selectedPaymentFrequencyIds.length === 0
    ) {
      return;
    }

    const ids = [...this.selectedPaymentFrequencyIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} frequência(s) de pagamento?`,
      accept: () => {
        this.service.deleteAll(ids).subscribe(() => {
          this.selectedPaymentFrequencyIds = [];
          this.selectedPaymentFrequencies = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Frequência(s) de pagamento excluída(s) com sucesso!',
          });
        });
      },
    });
  }

  openDetails(paymentFrequency: PaymentFrequency): void {
    const id = paymentFrequency.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.paymentFrequencyDetails = null;

    this.service.findById(id).subscribe({
      next: (details) => {
        this.paymentFrequencyDetails =
          PaymentFrequencyMapper.fromDetailsDTO(details);
      },
    });
  }
}
