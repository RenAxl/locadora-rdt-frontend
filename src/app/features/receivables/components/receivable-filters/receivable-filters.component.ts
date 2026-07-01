import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomerDTO } from 'src/app/features/customers/dtos/customer.dto';
import { CustomerService } from 'src/app/features/customers/services/customer.service';
import { PaymentFrequencyDTO } from 'src/app/features/payment-frequencies/dtos/payment-frequency.dto';
import { PaymentFrequencyService } from 'src/app/features/payment-frequencies/services/payment-frequency.service';
import { PaymentMethodDTO } from 'src/app/features/payment-methods/dtos/payment-method.dto';
import { PaymentMethodService } from 'src/app/features/payment-methods/services/payment-method.service';

import { ReceivableQuickPeriodRange } from '../receivable-quick-period-filter/receivable-quick-period-filter.component';
import { ReceivableFilters } from '../../services/receivable.service';

interface ReceivableSortOption {
  label: string;
  orderBy: string;
  direction: string;
}

@Component({
  selector: 'app-receivable-filters',
  templateUrl: './receivable-filters.component.html',
  styleUrls: ['./receivable-filters.component.scss'],
})
export class ReceivableFiltersComponent implements OnInit {
  @Output() filter = new EventEmitter<ReceivableFilters>();
  @Output() clear = new EventEmitter<void>();

  form: FormGroup;
  customers: CustomerDTO[] = [];
  paymentMethods: PaymentMethodDTO[] = [];
  paymentFrequencies: PaymentFrequencyDTO[] = [];

  sortOptions: ReceivableSortOption[] = [
    { label: 'Vencimento (mais próximo)', orderBy: 'dueDate', direction: 'ASC' },
    { label: 'Vencimento (mais distante)', orderBy: 'dueDate', direction: 'DESC' },
    { label: 'Maior valor', orderBy: 'amount', direction: 'DESC' },
    { label: 'Menor valor', orderBy: 'amount', direction: 'ASC' },
    { label: 'Mais recente', orderBy: 'createdDate', direction: 'DESC' },
    { label: 'Mais antiga', orderBy: 'createdDate', direction: 'ASC' },
  ];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private paymentMethodService: PaymentMethodService,
    private paymentFrequencyService: PaymentFrequencyService,
  ) {
    this.form = this.fb.group({
      search: [''],
      periodType: ['DUE_DATE'],
      startDate: [null],
      endDate: [null],
      status: ['ALL'],
      customerId: [null],
      customerSearch: [''],
      paymentMethodId: [null],
      paymentFrequencyId: [null],
      minimumAmount: [null],
      maximumAmount: [null],
      reference: [null],
      sort: [this.sortOptions[0]],
    });
  }

  ngOnInit(): void {
    this.loadOptions();
  }

  applyFilters(): void {
    this.syncCustomerId();
    const sort = this.form.get('sort')?.value as ReceivableSortOption;
    const value = this.form.value;

    this.filter.emit({
      search: this.trimToUndefined(value.search),
      periodType: value.periodType || 'DUE_DATE',
      startDate: value.startDate || null,
      endDate: value.endDate || null,
      status: value.status || 'ALL',
      customerId: value.customerId || null,
      paymentMethodId: value.paymentMethodId || null,
      paymentFrequencyId: value.paymentFrequencyId || null,
      minimumAmount: value.minimumAmount ?? null,
      maximumAmount: value.maximumAmount ?? null,
      reference: value.reference || null,
      orderBy: sort.orderBy,
      direction: sort.direction,
    });
  }

  clearFilters(): void {
    this.form.reset({
      search: '',
      periodType: 'DUE_DATE',
      startDate: null,
      endDate: null,
      status: 'ALL',
      customerId: null,
      customerSearch: '',
      paymentMethodId: null,
      paymentFrequencyId: null,
      minimumAmount: null,
      maximumAmount: null,
      reference: null,
      sort: this.sortOptions[0],
    });

    this.clear.emit();
  }

  onCustomerInput(): void {
    this.form.patchValue({ customerId: null }, { emitEvent: false });
  }

  onQuickPeriodChange(period: ReceivableQuickPeriodRange): void {
    this.form.patchValue({
      startDate: period.startDate,
      endDate: period.endDate,
    });

    this.applyFilters();
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

  private syncCustomerId(): void {
    const customerSearch = this.trimToUndefined(this.form.get('customerSearch')?.value);

    if (!customerSearch) {
      this.form.patchValue({ customerId: null }, { emitEvent: false });
      return;
    }

    const customer = this.customers.find(
      (item) => item.name.toLowerCase() === customerSearch.toLowerCase(),
    );

    this.form.patchValue({ customerId: customer?.id ?? null }, { emitEvent: false });
  }

  private trimToUndefined(value?: string | null): string | undefined {
    if (!value || !value.trim()) {
      return undefined;
    }

    return value.trim();
  }
}
