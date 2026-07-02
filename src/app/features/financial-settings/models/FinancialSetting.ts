export class FinancialSetting {
  id?: number;
  defaultLateFeePercent: number | null = 0;
  defaultLateInterestPercent: number | null = 0;
  createdAt?: Date;
  updatedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string | null;

  constructor(init?: Partial<FinancialSetting>) {
    Object.assign(this, init);
  }
}
