export interface ReportComparisonDTO {
  receivableTotal: number;
  payableTotal: number;
  balance: number;
  receivableCount: number;
  payableCount: number;
  year: number;
  months: ReportComparisonMonthDTO[];
}

export interface ReportComparisonMonthDTO {
  month: number;
  label: string;
  receivableTotal: number;
  payableTotal: number;
}
