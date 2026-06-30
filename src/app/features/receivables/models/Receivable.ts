export class Receivable {
  id?: number;
  description: string = '';
  amount?: number | null;
  dueDate?: Date | null;
  paymentDate?: Date | null;
  createdDate?: Date | null;
  fileName?: string | null;
  paid?: boolean | null;
  remainingBalance?: number | null;
  customerId?: number | null;
  customerName?: string | null;
  paymentMethodId?: number | null;
  paymentMethodName?: string | null;
  paymentFrequencyId?: number | null;
  paymentFrequency?: string | null;
  createdById?: number | null;
  createdByName?: string | null;
  paidById?: number | null;
  paidByName?: string | null;

  constructor(init?: Partial<Receivable>) {
    Object.assign(this, init);
  }
}
