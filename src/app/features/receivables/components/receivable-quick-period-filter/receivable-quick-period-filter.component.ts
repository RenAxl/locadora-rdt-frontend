import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export interface ReceivableQuickPeriodRange {
  startDate: string | null;
  endDate: string | null;
}

interface ReceivableQuickPeriodOption {
  key: string;
  label: string;
}

@Component({
  selector: 'app-receivable-quick-period-filter',
  templateUrl: './receivable-quick-period-filter.component.html',
  styleUrls: ['./receivable-quick-period-filter.component.scss'],
})
export class ReceivableQuickPeriodFilterComponent implements OnChanges {
  @Input() startDate: string | null = null;
  @Input() endDate: string | null = null;
  @Output() periodChange = new EventEmitter<ReceivableQuickPeriodRange>();

  selectedPeriod: string | null = null;

  periods: ReceivableQuickPeriodOption[] = [
    { key: 'TODAY', label: 'Hoje' },
    { key: 'YESTERDAY', label: 'Ontem' },
    { key: 'TOMORROW', label: 'Amanhã' },
    { key: 'THIS_WEEK', label: 'Esta Semana' },
    { key: 'NEXT_WEEK', label: 'Próxima Semana' },
    { key: 'THIS_MONTH', label: 'Este Mês' },
    { key: 'LAST_MONTH', label: 'Mês Passado' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.selectedPeriod || (!changes['startDate'] && !changes['endDate'])) {
      return;
    }

    const selectedRange = this.getRange(this.selectedPeriod);
    if (
      selectedRange.startDate !== this.startDate ||
      selectedRange.endDate !== this.endDate
    ) {
      this.selectedPeriod = null;
    }
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    this.periodChange.emit(this.getRange(period));
  }

  clearPeriod(): void {
    this.selectedPeriod = null;
    this.periodChange.emit({ startDate: null, endDate: null });
  }

  private getRange(period: string): ReceivableQuickPeriodRange {
    const today = this.startOfDay(new Date());

    if (period === 'TODAY') {
      return this.singleDay(today);
    }

    if (period === 'YESTERDAY') {
      return this.singleDay(this.addDays(today, -1));
    }

    if (period === 'TOMORROW') {
      return this.singleDay(this.addDays(today, 1));
    }

    if (period === 'THIS_WEEK') {
      return this.weekRange(today);
    }

    if (period === 'NEXT_WEEK') {
      return this.weekRange(this.addDays(today, 7));
    }

    if (period === 'THIS_MONTH') {
      return this.monthRange(today.getFullYear(), today.getMonth());
    }

    return this.monthRange(today.getFullYear(), today.getMonth() - 1);
  }

  private singleDay(date: Date): ReceivableQuickPeriodRange {
    const formattedDate = this.formatDate(date);
    return { startDate: formattedDate, endDate: formattedDate };
  }

  private weekRange(date: Date): ReceivableQuickPeriodRange {
    const dayOfWeek = date.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = this.addDays(date, mondayOffset);
    const sunday = this.addDays(monday, 6);

    return {
      startDate: this.formatDate(monday),
      endDate: this.formatDate(sunday),
    };
  }

  private monthRange(year: number, month: number): ReceivableQuickPeriodRange {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      startDate: this.formatDate(firstDay),
      endDate: this.formatDate(lastDay),
    };
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private formatDate(date: Date): string {
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
