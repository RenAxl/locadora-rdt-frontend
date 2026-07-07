import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomerDTO } from 'src/app/features/customers/dtos/customer.dto';
import { CustomerService } from 'src/app/features/customers/services/customer.service';
import { EmployeeDTO } from 'src/app/features/employees/dtos/employee.dto';
import { EmployeeService } from 'src/app/features/employees/services/employee.service';
import { PaymentMethodDTO } from 'src/app/features/payment-methods/dtos/payment-method.dto';
import { PaymentMethodService } from 'src/app/features/payment-methods/services/payment-method.service';
import { SupplierDTO } from 'src/app/features/suppliers/dtos/supplier.dto';
import { SupplierService } from 'src/app/features/suppliers/services/supplier.service';

import { ReportFilterDTO } from '../../dtos/report-filter.dto';
import { ReportService } from '../../services/report.service';

interface ReportOption {
  value: string;
  label: string;
  fileName: string;
}

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
})
export class ReportListComponent implements OnInit {
  form: FormGroup;
  customers: CustomerDTO[] = [];
  suppliers: SupplierDTO[] = [];
  employees: EmployeeDTO[] = [];
  paymentMethods: PaymentMethodDTO[] = [];
  loading = false;

  reportOptions: ReportOption[] = [
    { value: 'receivables', label: 'Contas a Receber', fileName: 'contas-a-receber' },
    { value: 'payables', label: 'Contas a Pagar', fileName: 'contas-a-pagar' },
    { value: 'financial', label: 'Financeiro', fileName: 'financeiro' },
    { value: 'summary-customer', label: 'Sintético por Cliente', fileName: 'sintetico-cliente' },
    { value: 'summary-supplier', label: 'Sintético por Fornecedor', fileName: 'sintetico-fornecedor' },
    { value: 'summary-employee', label: 'Sintético por Funcionário', fileName: 'sintetico-funcionario' },
    { value: 'annual-balance', label: 'Balanço Anual', fileName: 'balanco-anual' },
  ];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private customerService: CustomerService,
    private supplierService: SupplierService,
    private employeeService: EmployeeService,
    private paymentMethodService: PaymentMethodService,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      reportType: ['receivables'],
      search: [''],
      periodType: ['DUE_DATE'],
      startDate: [null],
      endDate: [null],
      status: ['ALL'],
      customerId: [null],
      supplierId: [null],
      employeeId: [null],
      paymentMethodId: [null],
      minimumAmount: [null],
      maximumAmount: [null],
      year: [new Date().getFullYear()],
      voucherAccountType: ['receivable'],
      voucherAccountId: [null],
    });
  }

  ngOnInit(): void {
    this.loadOptions();
  }

  get selectedReportType(): string {
    return this.form.get('reportType')?.value || 'receivables';
  }

  showPeriodFilters(): boolean {
    return this.selectedReportType !== 'annual-balance';
  }

  showStatusFilter(): boolean {
    return ['receivables', 'payables', 'financial'].includes(this.selectedReportType);
  }

  showCustomerFilter(): boolean {
    return ['receivables', 'financial', 'summary-customer'].includes(this.selectedReportType);
  }

  showSupplierFilter(): boolean {
    return ['payables', 'financial', 'summary-supplier'].includes(this.selectedReportType);
  }

  showEmployeeFilter(): boolean {
    return ['payables', 'financial', 'summary-employee'].includes(this.selectedReportType);
  }

  showAnnualFilter(): boolean {
    return this.selectedReportType === 'annual-balance';
  }

  generate(format: 'pdf' | 'xlsx'): void {
    const validationMessage = this.validateFilters();

    if (validationMessage) {
      this.messageService.add({ severity: 'warn', detail: validationMessage });
      return;
    }

    const reportType = this.selectedReportType;
    const filters = this.buildFilters();
    const option = this.reportOptions.find((item) => item.value === reportType);
    const fileName = `${option?.fileName || reportType}.${format}`;

    this.loading = true;
    this.reportService.generate(reportType, format, filters).subscribe({
      next: (blob) => {
        this.loading = false;
        this.openOrDownload(blob, format, fileName);
      },
      error: (err) => {
        this.loading = false;
        this.showError(err, 'Erro ao gerar relatório.');
      },
    });
  }

  generateVoucher(format: 'pdf' | 'xlsx'): void {
    const accountId = Number(this.form.get('voucherAccountId')?.value);

    if (!accountId || accountId <= 0) {
      this.messageService.add({ severity: 'warn', detail: 'Informe o número da conta.' });
      return;
    }

    const accountType = this.form.get('voucherAccountType')?.value || 'receivable';
    const fileName = `comprovante-${accountType}-${accountId}.${format}`;

    this.loading = true;
    this.reportService.voucher(accountType, accountId, format).subscribe({
      next: (blob) => {
        this.loading = false;
        this.openOrDownload(blob, format, fileName);
      },
      error: (err) => {
        this.loading = false;
        this.showError(err, 'Erro ao gerar comprovante.');
      },
    });
  }

  clearFilters(): void {
    this.form.reset({
      reportType: 'receivables',
      search: '',
      periodType: 'DUE_DATE',
      startDate: null,
      endDate: null,
      status: 'ALL',
      customerId: null,
      supplierId: null,
      employeeId: null,
      paymentMethodId: null,
      minimumAmount: null,
      maximumAmount: null,
      year: new Date().getFullYear(),
      voucherAccountType: 'receivable',
      voucherAccountId: null,
    });
  }

  private buildFilters(): ReportFilterDTO {
    const value = this.form.value;

    return {
      search: this.trimToUndefined(value.search),
      startDate: value.startDate || null,
      endDate: value.endDate || null,
      status: value.status || 'ALL',
      periodType: value.periodType || 'DUE_DATE',
      customerId: value.customerId || null,
      supplierId: value.supplierId || null,
      employeeId: value.employeeId || null,
      paymentMethodId: value.paymentMethodId || null,
      minimumAmount: value.minimumAmount ?? null,
      maximumAmount: value.maximumAmount ?? null,
      year: value.year || null,
    };
  }

  private openOrDownload(blob: Blob, format: 'pdf' | 'xlsx', fileName: string): void {
    if (format === 'pdf') {
      this.reportService.openPdf(blob);
      return;
    }

    this.reportService.download(blob, fileName);
  }

  private validateFilters(): string | null {
    const value = this.form.value;

    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      return 'Data inicial não pode ser maior que a data final.';
    }

    if (value.minimumAmount != null && value.maximumAmount != null
      && Number(value.minimumAmount) > Number(value.maximumAmount)) {
      return 'Valor inicial não pode ser maior que o valor final.';
    }

    if (this.showAnnualFilter() && (!value.year || Number(value.year) < 1900)) {
      return 'Informe um ano válido.';
    }

    return null;
  }

  private loadOptions(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    this.customerService
      .list(pagination, '')
      .subscribe((response) => (this.customers = response.content));

    this.supplierService
      .list(pagination, '')
      .subscribe((response) => (this.suppliers = response.content));

    this.employeeService
      .list(pagination, '')
      .subscribe((response) => (this.employees = response.content));

    this.paymentMethodService
      .list(pagination, '')
      .subscribe((response) => (this.paymentMethods = response.content));
  }

  private trimToUndefined(value?: string | null): string | undefined {
    if (!value || !value.trim()) {
      return undefined;
    }

    return value.trim();
  }

  private showError(err: any, fallback: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: err?.error?.message || err?.error?.error || fallback,
    });
  }
}
