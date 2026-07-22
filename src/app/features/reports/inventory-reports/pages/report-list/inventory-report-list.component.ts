import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { ItemDTO } from 'src/app/features/items/dtos/item.dto';
import { ItemService } from 'src/app/features/items/services/item.service';

import { InventoryReportFilterDTO } from '../../dtos/inventory-report-filter.dto';
import { InventoryReportService } from '../../services/inventory-report.service';

interface ReportOption {
  value: string;
  label: string;
  fileName: string;
}

@Component({
  selector: 'app-inventory-report-list',
  templateUrl: './inventory-report-list.component.html',
  styleUrls: ['./inventory-report-list.component.css'],
})
export class InventoryReportListComponent implements OnInit {
  form: FormGroup;
  items: ItemDTO[] = [];
  loading = false;

  reportOptions: ReportOption[] = [
    {
      value: 'current-stock',
      label: 'Saldo Atual de Estoque',
      fileName: 'saldo-atual-estoque',
    },
    {
      value: 'low-stock',
      label: 'Estoque Baixo',
      fileName: 'estoque-baixo',
    },
    {
      value: 'movement-history',
      label: 'Histórico de Movimentações',
      fileName: 'historico-movimentacoes',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private inventoryReportService: InventoryReportService,
    private itemService: ItemService,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      reportType: ['current-stock'],
      startDate: [null],
      endDate: [null],
      itemId: [null],
      movementType: ['ALL'],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  get selectedReportType(): string {
    return this.form.get('reportType')?.value || 'current-stock';
  }

  showMovementFilters(): boolean {
    return this.selectedReportType === 'movement-history';
  }

  showMovementTypeFilter(): boolean {
    return this.selectedReportType === 'movement-history';
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
    this.inventoryReportService.generate(reportType, format, filters).subscribe({
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

  clearFilters(): void {
    this.form.reset({
      reportType: 'current-stock',
      startDate: null,
      endDate: null,
      itemId: null,
      movementType: 'ALL',
    });
  }

  private buildFilters(): InventoryReportFilterDTO {
    const value = this.form.value;

    return {
      startDate: value.startDate || null,
      endDate: value.endDate || null,
      itemId: value.itemId || null,
      movementType: value.movementType || 'ALL',
    };
  }

  private validateFilters(): string | null {
    const value = this.form.value;

    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      return 'Data inicial não pode ser maior que a data final.';
    }

    return null;
  }

  private loadItems(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    this.itemService.list(pagination, '').subscribe({
      next: (response) => {
        this.items = response?.content ?? [];
      },
      error: () => {
        this.items = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Não foi possível carregar os itens.',
        });
      },
    });
  }

  private openOrDownload(blob: Blob, format: 'pdf' | 'xlsx', fileName: string): void {
    if (format === 'pdf') {
      this.inventoryReportService.openPdf(blob);
      return;
    }

    this.inventoryReportService.download(blob, fileName);
  }

  private showError(err: any, fallback: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: err?.error?.message || fallback,
    });
  }

}
