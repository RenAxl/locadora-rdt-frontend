export class Receivable {
  id?: number;
  description: string = '';
  amount?: number | null;
  dueDate?: Date | null;
  paymentDate?: Date | null;
  createdDate?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  note?: string | null;
  fileName?: string | null;
  paid?: boolean | null;
  remainingBalance?: number | null;
  lateFee?: number | null;
  lateInterest?: number | null;
  discount?: number | null;
  fee?: number | null;
  subtotal?: number | null;
  currentAmountWithLateCharges?: number | null;
  overdueDays?: number | null;
  calculatedLateInterest?: number | null;
  calculatedLateFee?: number | null;
  residual?: boolean | null;
  canceled?: boolean | null;
  parentReceivableId?: number | null;
  customerId?: number | null = null;
  customerName?: string | null;
  paymentMethodId?: number | null = null;
  paymentMethodName?: string | null;
  paymentFrequencyId?: number | null = null;
  paymentFrequency?: string | null;
  createdById?: number | null;
  createdByName?: string | null;
  paidById?: number | null;
  paidByName?: string | null;

  constructor(init?: Partial<Receivable>) {
    Object.assign(this, init);
  }
}
