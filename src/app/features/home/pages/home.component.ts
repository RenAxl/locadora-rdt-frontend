import { Component, OnInit } from '@angular/core';
import { ReportComparisonDTO } from '../../reports/financial-reports/dtos/report-comparison.dto';
import { ReportService } from '../../reports/financial-reports/services/report.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  chartLoading = false;
  comparison: ReportComparisonDTO = {
    receivableTotal: 0,
    payableTotal: 0,
    balance: 0,
    receivableCount: 0,
    payableCount: 0,
    year: new Date().getFullYear(),
    months: [],
  };

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadComparison();
  }

  loadComparison(): void {
    const year = new Date().getFullYear();
    this.chartLoading = true;
    this.reportService.comparison({
      year,
      status: 'ALL',
      periodType: 'DUE_DATE',
    }).subscribe({
      next: (comparison) => {
        this.chartLoading = false;
        this.comparison = comparison;
      },
      error: () => {
        this.chartLoading = false;
      },
    });
  }

  get chartYear(): number {
    return this.comparison.year || new Date().getFullYear();
  }

  get balanceClass(): string {
    if (this.comparison.balance > 0) {
      return 'positive';
    }

    if (this.comparison.balance < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  get chartMaxValue(): number {
    const values = this.comparison.months.flatMap((month) => [
      month.receivableTotal || 0,
      month.payableTotal || 0,
    ]);
    const max = Math.max(...values, 0);

    if (max <= 0) {
      return 100;
    }

    return Math.ceil(max / 100) * 100;
  }

  chartColumnHeight(value: number): string {
    if (this.chartMaxValue <= 0 || value <= 0) {
      return '0%';
    }

    return `${Math.max((value / this.chartMaxValue) * 100, 2)}%`;
  }

  chartTickValue(multiplier: number): number {
    return this.chartMaxValue * multiplier;
  }
}
