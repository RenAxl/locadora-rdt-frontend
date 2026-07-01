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

import { PaymentMethodMapper } from '../../mapper/payment-method.mapper';
import { PaymentMethod } from '../../models/PaymentMethod';
import { PaymentMethodService } from '../../services/payment-method.service';

@Component({
  selector: 'app-payment-method-list',
  templateUrl: './payment-method-list.component.html',
  styleUrls: ['./payment-method-list.component.css'],
})
export class PaymentMethodListComponent {
  paymentMethods: PaymentMethod[] = [];
  pagination: Pagination = new Pagination();
  totalElements: number = 0;
  filterName: string = '';

  selectedPaymentMethods: PaymentMethod[] = [];
  selectedPaymentMethodIds: number[] = [];

  detailsVisible = false;
  paymentMethodDetails: PaymentMethod | null = null;

  @ViewChild('paymentMethodTable') grid!: Table;

  constructor(
    private service: PaymentMethodService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}
  list(page: number = 0): void {
    this.pagination.page = page;

    this.service.list(this.pagination, this.filterName).subscribe((data) => {
      this.paymentMethods = data.content.map(PaymentMethodMapper.fromDTO);
      this.totalElements = data.totalElements;
    });
  }

  changePage(event: LazyLoadEvent): void {
    const page = event.first! / event.rows!;
    this.list(page);
  }

  searchPaymentMethod(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(paymentMethod: PaymentMethod): void {
    if (!paymentMethod.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.service.delete(paymentMethod.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Forma de pagamento excluída com sucesso!',
          });
        });
      },
    });
  }

  onRowSelect(event: any): void {
    this.selectedPaymentMethodIds = addSelectedId(
      this.selectedPaymentMethodIds,
      event?.data,
    );
  }

  onRowUnselect(event: any): void {
    this.selectedPaymentMethodIds = removeSelectedId(
      this.selectedPaymentMethodIds,
      event?.data,
    );
  }

  deleteSelectedPaymentMethods(): void {
    if (
      !this.selectedPaymentMethodIds ||
      this.selectedPaymentMethodIds.length === 0
    ) {
      return;
    }

    const ids = [...this.selectedPaymentMethodIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} forma(s) de pagamento?`,
      accept: () => {
        this.service.deleteAll(ids).subscribe(() => {
          this.selectedPaymentMethodIds = [];
          this.selectedPaymentMethods = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Forma(s) de pagamento excluída(s) com sucesso!',
          });
        });
      },
    });
  }

  openDetails(paymentMethod: PaymentMethod): void {
    const id = paymentMethod.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.paymentMethodDetails = null;

    this.service.findById(id).subscribe({
      next: (details) => {
        this.paymentMethodDetails =
          PaymentMethodMapper.fromDetailsDTO(details);
      },
    });
  }
}
