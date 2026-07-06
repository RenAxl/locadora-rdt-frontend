import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from 'src/app/core/models/Pagination';
import { EmployeeDTO } from 'src/app/features/employees/dtos/employee.dto';
import { EmployeeService } from 'src/app/features/employees/services/employee.service';
import { PaymentFrequencyDTO } from 'src/app/features/payment-frequencies/dtos/payment-frequency.dto';
import { PaymentFrequencyService } from 'src/app/features/payment-frequencies/services/payment-frequency.service';
import { PaymentMethodDTO } from 'src/app/features/payment-methods/dtos/payment-method.dto';
import { PaymentMethodService } from 'src/app/features/payment-methods/services/payment-method.service';
import { SupplierDTO } from 'src/app/features/suppliers/dtos/supplier.dto';
import { SupplierService } from 'src/app/features/suppliers/services/supplier.service';

import { PayableQuickPeriodRange } from '../payable-quick-period-filter/payable-quick-period-filter.component';
import { PayableFilters } from '../../services/payable.service';

interface PayableSortOption {
  label: string;
  orderBy: string;
  direction: string;
}

@Component({
  selector: 'app-payable-filters',
  templateUrl: './payable-filters.component.html',
  styleUrls: ['./payable-filters.component.scss'],
})
export class PayableFiltersComponent implements OnInit {
  @Output() filter = new EventEmitter<PayableFilters>();
  @Output() clear = new EventEmitter<void>();

  form: FormGroup;
  suppliers: SupplierDTO[] = [];
  employees: EmployeeDTO[] = [];
  paymentMethods: PaymentMethodDTO[] = [];
  paymentFrequencies: PaymentFrequencyDTO[] = [];

  sortOptions: PayableSortOption[] = [
    { label: 'Vencimento (mais próximo)', orderBy: 'dueDate', direction: 'ASC' },
    { label: 'Vencimento (mais distante)', orderBy: 'dueDate', direction: 'DESC' },
    { label: 'Maior valor', orderBy: 'amount', direction: 'DESC' },
    { label: 'Menor valor', orderBy: 'amount', direction: 'ASC' },
    { label: 'Mais recente', orderBy: 'createdDate', direction: 'DESC' },
    { label: 'Mais antiga', orderBy: 'createdDate', direction: 'ASC' },
  ];

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private employeeService: EmployeeService,
    private paymentMethodService: PaymentMethodService,
    private paymentFrequencyService: PaymentFrequencyService,
  ) {
    this.form = this.fb.group({
      search: [''],
      periodType: ['DUE_DATE'],
      startDate: [null],
      endDate: [null],
      status: ['ALL'],
      supplierId: [null],
      supplierSearch: [''],
      employeeId: [null],
      employeeSearch: [''],
      paymentMethodId: [null],
      paymentFrequencyId: [null],
      minimumAmount: [null],
      maximumAmount: [null],
      sort: [this.sortOptions[0]],
    });
  }

  ngOnInit(): void {
    this.loadOptions();
  }

  applyFilters(): void {
    this.syncSupplierId();
    this.syncEmployeeId();
    const sort = this.form.get('sort')?.value as PayableSortOption;
    const value = this.form.value;

    this.filter.emit({
      search: this.trimToUndefined(value.search),
      periodType: value.periodType || 'DUE_DATE',
      startDate: value.startDate || null,
      endDate: value.endDate || null,
      status: value.status || 'ALL',
      supplierId: value.supplierId || null,
      employeeId: value.employeeId || null,
      paymentMethodId: value.paymentMethodId || null,
      paymentFrequencyId: value.paymentFrequencyId || null,
      minimumAmount: value.minimumAmount ?? null,
      maximumAmount: value.maximumAmount ?? null,
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
      supplierId: null,
      supplierSearch: '',
      employeeId: null,
      employeeSearch: '',
      paymentMethodId: null,
      paymentFrequencyId: null,
      minimumAmount: null,
      maximumAmount: null,
      sort: this.sortOptions[0],
    });

    this.clear.emit();
  }

  onSupplierInput(): void {
    this.form.patchValue({ supplierId: null }, { emitEvent: false });
  }

  onEmployeeInput(): void {
    this.form.patchValue({ employeeId: null }, { emitEvent: false });
  }

  onQuickPeriodChange(period: PayableQuickPeriodRange): void {
    this.form.patchValue({
      startDate: period.startDate,
      endDate: period.endDate,
    });

    this.applyFilters();
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

  private syncSupplierId(): void {
    const supplierSearch = this.trimToUndefined(this.form.get('supplierSearch')?.value);

    if (!supplierSearch) {
      this.form.patchValue({ supplierId: null }, { emitEvent: false });
      return;
    }

    const supplier = this.suppliers.find(
      (item) => item.name.toLowerCase() === supplierSearch.toLowerCase(),
    );

    this.form.patchValue({ supplierId: supplier?.id ?? null }, { emitEvent: false });
  }

  private syncEmployeeId(): void {
    const employeeSearch = this.trimToUndefined(this.form.get('employeeSearch')?.value);

    if (!employeeSearch) {
      this.form.patchValue({ employeeId: null }, { emitEvent: false });
      return;
    }

    const employee = this.employees.find(
      (item) => item.name.toLowerCase() === employeeSearch.toLowerCase(),
    );

    this.form.patchValue({ employeeId: employee?.id ?? null }, { emitEvent: false });
  }

  private trimToUndefined(value?: string | null): string | undefined {
    if (!value || !value.trim()) {
      return undefined;
    }

    return value.trim();
  }
}
